import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-user-id',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Verify authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.error("No authorization header")
      throw new Error('No authorization header')
    }

    const { email, firstName, lastName, subscriptionPlan, createdBy } = await req.json()
    console.log("Starting customer creation with data:", { email, firstName, lastName, subscriptionPlan, createdBy })

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    // Create auth user
    console.log("Creating auth user")
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: Math.random().toString(36).slice(-8),
      email_confirm: true,
    })

    if (authError) {
      console.error("Error creating auth user:", authError)
      throw new Error(authError.message)
    }

    if (!authData.user) {
      console.error("No user data returned from auth creation")
      throw new Error("Failed to create user")
    }

    console.log("Auth user created successfully:", authData.user.id)

    // Update profile data
    console.log("Updating profile data")
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({
        first_name: firstName,
        last_name: lastName,
        role: 'customer',
      })
      .eq('id', authData.user.id)

    if (profileError) {
      console.error("Error updating profile:", profileError)
      throw new Error("Failed to update profile")
    }

    // Update customer data
    console.log("Updating customer data")
    const { error: customerError } = await supabaseAdmin
      .from('customers')
      .update({
        subscription_plan: subscriptionPlan,
        created_by: createdBy,
      })
      .eq('id', authData.user.id)

    if (customerError) {
      console.error("Error updating customer:", customerError)
      throw new Error("Failed to update customer")
    }

    console.log("Customer creation completed successfully")
    return new Response(
      JSON.stringify({ 
        success: true, 
        userId: authData.user.id,
        message: "Customer created successfully"
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    )
  } catch (err) {
    console.error("Error in create-customer function:", err)
    return new Response(
      JSON.stringify({ 
        error: err.message || "An unexpected error occurred",
        details: err.toString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    )
  }
})