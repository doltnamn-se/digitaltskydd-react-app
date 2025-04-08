
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { handleQueryResult } from "@/utils/supabaseHelpers";

type SubscriptionCount = {
  plan: string;
  count: number;
}

type CustomerTypeCount = {
  type: string;
  count: number;
}

type CustomerSubscriptionBreakdown = {
  type: string;
  totalCount: number;
  subscriptions: {
    [key: string]: number;
  };
}

export const useAdminDashboardData = () => {
  const [totalCustomers, setTotalCustomers] = useState<number>(0);
  const [customerBreakdown, setCustomerBreakdown] = useState<CustomerSubscriptionBreakdown[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch all customers with their customer_type and subscription_plan
        const { data, error } = await supabase
          .from('customers')
          .select(`
            id, 
            customer_type,
            subscription_plan
          `);

        if (error) {
          console.error('Error fetching customer data:', error);
          return;
        }

        console.log('Raw customer data:', data);

        // Process the data
        const totalCount = data.length;
        setTotalCustomers(totalCount);

        // Initialize breakdown structure with default values for all subscription plans
        const breakdown: { [key: string]: CustomerSubscriptionBreakdown } = {
          'private': {
            type: 'private',
            totalCount: 0,
            subscriptions: {
              '1_month': 0,
              '6_months': 0,
              '12_months': 0,
              '24_months': 0
            }
          },
          'business': {
            type: 'business',
            totalCount: 0,
            subscriptions: {
              '1_month': 0,
              '6_months': 0,
              '12_months': 0,
              '24_months': 0
            }
          }
        };
        
        // Totals across all customer types
        const totalSubscriptions = {
          '1_month': 0,
          '6_months': 0,
          '12_months': 0,
          '24_months': 0
        };

        // Process each customer
        data.forEach((customer: any) => {
          const type = customer.customer_type || 'private';
          const plan = customer.subscription_plan || '1_month';
          
          // Increment type count
          breakdown[type].totalCount++;
          
          // Increment subscription count for this type
          if (breakdown[type].subscriptions[plan] !== undefined) {
            breakdown[type].subscriptions[plan]++;
          }
          
          // Increment total subscription count
          if (totalSubscriptions[plan] !== undefined) {
            totalSubscriptions[plan]++;
          }
        });

        // Add the total breakdown
        const allBreakdown = {
          type: 'all',
          totalCount,
          subscriptions: totalSubscriptions
        };

        // Convert to array
        setCustomerBreakdown([
          allBreakdown,
          breakdown.private,
          breakdown.business
        ]);
      } catch (error) {
        console.error('Error processing dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to get subscription counts for a specific type
  const getSubscriptionDataForType = (type: 'all' | 'private' | 'business') => {
    const typeData = customerBreakdown.find(item => item.type === type);
    if (!typeData) return [];
    
    return Object.entries(typeData.subscriptions).map(([plan, count]) => ({
      plan,
      count
    }));
  };

  return {
    totalCustomers,
    customerBreakdown,
    isLoading,
    getSubscriptionDataForType
  };
};
