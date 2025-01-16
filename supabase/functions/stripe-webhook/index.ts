import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from "https://esm.sh/stripe@14.21.0"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  // Handle subscription status check requests
  if (req.method === 'GET') {
    try {
      const authHeader = req.headers.get('Authorization')
      if (!authHeader) {
        throw new Error('No authorization header')
      }

      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_ANON_KEY') ?? '',
        {
          global: {
            headers: { Authorization: authHeader },
          },
        }
      )

      const { data: { user }, error: userError } = await supabase.auth.getUser(
        authHeader.replace('Bearer ', '')
      )

      if (userError || !user) {
        throw new Error('Error getting user')
      }

      const { data: subscription, error: subError } = await supabase
        .from('subscriptions')
        .select('status, cancel_at_period_end')
        .eq('customer_id', user.id)
        .single()

      if (subError) {
        console.error('Subscription check error:', subError)
        throw new Error('Error checking subscription')
      }

      return new Response(
        JSON.stringify({
          subscribed: subscription?.status === 'active' && !subscription?.cancel_at_period_end
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    } catch (error) {
      console.error('Subscription check error:', error)
      return new Response(
        JSON.stringify({ error: error.message }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }
  }

  // Handle webhook POST requests
  const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
    apiVersion: '2023-10-16',
  })

  const signature = req.headers.get('stripe-signature')
  if (!signature) {
    console.error('No Stripe signature found')
    return new Response(JSON.stringify({ error: 'No signature' }), { 
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SIGNING_SECRET')
  if (!webhookSecret) {
    console.error('Webhook secret not configured')
    return new Response(JSON.stringify({ error: 'Webhook secret not configured' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  try {
    const body = await req.text()
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    console.log(`Stripe webhook received: ${event.type}`)

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    switch (event.type) {
      case 'customer.created': {
        const customer = event.data.object as Stripe.Customer
        if (!customer.email) {
          console.error('No email found in customer data')
          break
        }

        // Check if user already exists
        const { data: existingUser } = await supabase
          .from('auth.users')
          .select('id')
          .eq('email', customer.email)
          .single()

        if (!existingUser) {
          // Create new user in Supabase
          const password = crypto.randomUUID() // Generate a random password
          const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
            email: customer.email,
            password: password,
            email_confirm: true
          })

          if (createError) {
            console.error('Error creating user:', createError)
            break
          }

          console.log('Created new user in Supabase:', newUser.user.id)

          // Create customer record
          const { error: customerError } = await supabase
            .from('customers')
            .insert({
              id: newUser.user.id,
              stripe_customer_id: customer.id,
            })

          if (customerError) {
            console.error('Error creating customer record:', customerError)
          }

          // Generate password reset link and send email using Supabase
          const { error: resetError } = await supabase.auth.admin.generateLink({
            type: 'recovery',
            email: customer.email,
          })

          if (resetError) {
            console.error('Error generating password reset link:', resetError)
          } else {
            console.log('Password reset link generated and email sent via Supabase')
          }
        }
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customer = subscription.customer as string

        const { data: customerData, error: customerError } = await supabase
          .from('customers')
          .select('id')
          .eq('stripe_customer_id', customer)
          .single()

        if (customerError || !customerData) {
          console.error('Error finding customer:', customerError)
          break
        }

        const subscriptionData = {
          id: subscription.id,
          customer_id: customerData.id,
          stripe_subscription_id: subscription.id,
          stripe_price_id: subscription.items.data[0].price.id,
          status: subscription.status,
          cancel_at_period_end: subscription.cancel_at_period_end,
          cancel_at: subscription.cancel_at ? new Date(subscription.cancel_at * 1000).toISOString() : null,
          canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        }

        const { error: subscriptionError } = await supabase
          .from('subscriptions')
          .upsert(subscriptionData)

        if (subscriptionError) {
          console.error('Error upserting subscription:', subscriptionError)
        }
        break
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (err) {
    console.error('Error processing webhook:', err)
    return new Response(
      JSON.stringify({ error: 'Webhook processing failed' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})