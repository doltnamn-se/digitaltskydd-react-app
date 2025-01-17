import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "./LoadingSpinner";
import Auth from "@/pages/Auth";

export const AuthRoute = () => {
  const [session, setSession] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Clear any existing session first to ensure clean state
        await supabase.auth.signOut();
        
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (!currentSession) {
          console.log("AuthRoute: No session found, allowing auth page access");
          setSession(false);
          setIsLoading(false);
          return;
        }

        console.log("AuthRoute: Session found, checking role");
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', currentSession.user.id)
          .single();

        if (profile?.role === 'super_admin') {
          console.log("AuthRoute: Super admin detected, redirecting to admin");
          setSession(true);
        } else {
          console.log("AuthRoute: Regular user, checking onboarding");
          const { data: customer } = await supabase
            .from('customers')
            .select('onboarding_completed')
            .eq('id', currentSession.user.id)
            .single();

          setSession(true);
        }
      } catch (error) {
        console.error("AuthRoute: Error:", error);
        // On error, clear session and show auth page
        await supabase.auth.signOut();
        setSession(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("AuthRoute: Auth state changed:", event);
      if (!session) {
        setSession(false);
        setIsLoading(false);
        return;
      }
      checkAuth();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (session) {
    return <Navigate to="/" replace />;
  }

  return <Auth />;
};