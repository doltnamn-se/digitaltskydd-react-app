
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CustomerWithProfile } from "@/types/customer";
import { toast } from "sonner";

export const useCustomers = () => {
  const [customers, setCustomers] = useState<CustomerWithProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select(`
          *,
          profile: profiles (
            id,
            display_name,
            email,
            avatar_url,
            role,
            created_at,
            updated_at
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching customers:', error);
        toast.error("Failed to load customers");
        return;
      }

      // Filter out entries with no profile data or duplicate profiles
      const uniqueCustomers = data?.reduce((acc: CustomerWithProfile[], current) => {
        if (current.profile && !acc.some(item => item.profile?.id === current.profile?.id)) {
          acc.push(current);
        }
        return acc;
      }, []) || [];

      setCustomers(uniqueCustomers);
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to load customers");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return { customers, isLoading, fetchCustomers };
};
