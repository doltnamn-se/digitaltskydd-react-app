import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CustomerWithProfile } from "@/types/customer";
import { useToast } from "@/hooks/use-toast";

export const useCustomers = () => {
  const { toast } = useToast();

  const { data: customers, refetch, isLoading, error } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      console.log("Fetching customers...");
      
      const { data: customersData, error: customersError } = await supabase
        .from('customers')
        .select(`
          *,
          profiles (
            id,
            email,
            display_name,
            role,
            created_at,
            updated_at,
            first_name,
            last_name
          )
        `)
        .eq('id', 'profiles.id');

      if (customersError) {
        console.error("Error fetching customers:", customersError);
        throw customersError;
      }

      console.log("Raw customers data:", customersData);

      const transformedData = customersData?.map(customer => ({
        ...customer,
        profile: {
          id: customer.profiles?.id || customer.id,
          email: customer.profiles?.email || null,
          display_name: customer.profiles?.display_name || null,
          role: customer.profiles?.role || null,
          created_at: customer.profiles?.created_at || customer.created_at || '',
          updated_at: customer.profiles?.updated_at || customer.updated_at || '',
          first_name: customer.profiles?.first_name || null,
          last_name: customer.profiles?.last_name || null
        }
      })) || [];

      console.log("Transformed customers data:", transformedData);
      return transformedData as CustomerWithProfile[];
    }
  });

  const handleDeleteCustomer = async (customerId: string) => {
    try {
      console.log("Starting deletion process for customer:", customerId);

      // First delete from notification_preferences
      const { error: notifPrefError } = await supabase
        .from('notification_preferences')
        .delete()
        .eq('user_id', customerId);

      if (notifPrefError) {
        console.error("Error deleting notification preferences:", notifPrefError);
        throw notifPrefError;
      }

      // Then delete from notifications
      const { error: notifError } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', customerId);

      if (notifError) {
        console.error("Error deleting notifications:", notifError);
        throw notifError;
      }

      // Delete from hiding_preferences
      const { error: hidingPrefError } = await supabase
        .from('hiding_preferences')
        .delete()
        .eq('customer_id', customerId);

      if (hidingPrefError) {
        console.error("Error deleting hiding preferences:", hidingPrefError);
        throw hidingPrefError;
      }

      // Delete from removal_urls
      const { error: removalUrlsError } = await supabase
        .from('removal_urls')
        .delete()
        .eq('customer_id', customerId);

      if (removalUrlsError) {
        console.error("Error deleting removal URLs:", removalUrlsError);
        throw removalUrlsError;
      }

      // Delete from profiles
      const { error: profilesError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', customerId);

      if (profilesError) {
        console.error("Error deleting profile:", profilesError);
        throw profilesError;
      }

      // Delete from customers
      const { error: customersError } = await supabase
        .from('customers')
        .delete()
        .eq('id', customerId);

      if (customersError) {
        console.error("Error deleting customer:", customersError);
        throw customersError;
      }

      // Finally delete the auth user using admin API
      const { error: authError } = await supabase.auth.admin.deleteUser(
        customerId
      );

      if (authError) {
        console.error("Error deleting auth user:", authError);
        throw authError;
      }

      console.log("Customer deleted successfully");
      toast({
        title: "Success",
        description: "Customer deleted successfully",
      });
      
      refetch();
    } catch (err) {
      console.error("Unexpected error deleting customer:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete customer. Please try again.",
      });
    }
  };

  return {
    customers,
    isLoading,
    error,
    refetch,
    handleDeleteCustomer
  };
};