import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://app.doltnamn.se',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Max-Age': '86400',
};

serve(async (req) => {
  console.log("Received request to create-customer function");
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Handling OPTIONS request");
    return new Response(null, { 
      headers: corsHeaders,
      status: 204
    });
  }

  try {
    console.log("Processing customer creation request");
    const requestData = await req.json();
    console.log("Received request data:", requestData);

    const { email, displayName, subscriptionPlan, createdBy, password } = requestData;

    if (!email || !displayName || !subscriptionPlan || !createdBy || !password) {
      console.error("Missing required fields:", { email, displayName, subscriptionPlan, createdBy });
      return new Response(
        JSON.stringify({
          error: "Missing required fields",
          received: { email, displayName, subscriptionPlan, createdBy }
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Step 1: Create auth user with the simple password from the request
    console.log("Creating auth user with provided password...");
    const { data: { user }, error: createUserError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        display_name: displayName
      }
    });

    if (createUserError) {
      console.error("Error creating auth user:", createUserError);
      return new Response(
        JSON.stringify({ error: createUserError.message }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    if (!user) {
      console.error("No user returned after creation");
      return new Response(
        JSON.stringify({ error: "Failed to create user" }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    console.log("Auth user created successfully:", user.id);

    // Step 2: Update customer subscription plan
    console.log("Creating customer record...");
    const { error: customerError } = await supabase
      .from('customers')
      .insert({ 
        id: user.id,
        subscription_plan: subscriptionPlan,
        created_by: createdBy 
      });

    if (customerError) {
      console.error("Error creating customer:", customerError);
      return new Response(
        JSON.stringify({ error: customerError.message }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // Step 3: Send welcome email
    console.log("Sending welcome email...");
    const { error: emailError } = await supabase.functions.invoke('send-activation-email', {
      body: {
        email: email,
        displayName: displayName,
        password: password
      }
    });

    if (emailError) {
      console.error("Error sending welcome email:", emailError);
      // Log the error but continue with profile creation
    }

    // Step 4: Create profile (only after successful email sending)
    console.log("Creating profile for user...");
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: email,
        display_name: displayName,
        role: 'customer'
      });

    if (profileError) {
      console.error("Error creating profile:", profileError);
      return new Response(
        JSON.stringify({ error: "Failed to create profile" }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        user: {
          id: user.id,
          email: user.email,
          created_at: user.created_at
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (err) {
    console.error("Error in create-customer function:", err);
    return new Response(
      JSON.stringify({
        error: err.message || "An unexpected error occurred"
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});