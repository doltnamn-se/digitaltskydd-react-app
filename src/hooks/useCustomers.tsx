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
          id,
          subscription_plan,
          onboarding_completed,
          onboarding_step,
          checklist_completed,
          checklist_step,
          identification_info,
          stripe_customer_id,
          profiles!inner (
            id,
            first_name,
            last_name,
            role,
            email,
            created_at,
            updated_at
          )
        `);

      if (customersError) {
        console.error("Error fetching customers:", customersError);
        throw customersError;
      }

      console.log("Raw customers data:", customersData);

      const transformedData = customersData?.map(customer => {
        return {
          subscription_plan: customer.subscription_plan,
          onboarding_completed: customer.onboarding_completed,
          onboarding_step: customer.onboarding_step,
          checklist_completed: customer.checklist_completed,
          checklist_step: customer.checklist_step,
          identification_info: customer.identification_info,
          stripe_customer_id: customer.stripe_customer_id,
          profile: customer.profiles
        };
      }) || [];

      console.log("Transformed customers data:", transformedData);
      return transformedData as CustomerWithProfile[];
    }
  });

  const handleDeleteCustomer = async (customerId: string) => {
    try {
      console.log("Deleting customer:", customerId);
      const { error: deleteError } = await supabase
        .from('customers')
        .delete()
        .eq('id', customerId);

      if (deleteError) {
        console.error("Error deleting customer:", deleteError);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete customer. Please try again.",
        });
        return;
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
        description: "An unexpected error occurred. Please try again.",
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