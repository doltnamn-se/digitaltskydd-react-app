
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { CustomerWithProfile } from "@/types/customer";
import { format, formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserInitials } from "@/utils/profileUtils";
import { BadgeCheck } from "lucide-react";
import { SubscriptionBadge } from "@/components/settings/profile/SubscriptionBadge";
import { useCustomerPresence } from "./useCustomerPresence";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface CustomerDetailsSheetProps {
  customer: CustomerWithProfile | null;
  onOpenChange: (open: boolean) => void;
}

export const CustomerDetailsSheet = ({ customer, onOpenChange }: CustomerDetailsSheetProps) => {
  const { onlineUsers, lastSeen } = useCustomerPresence();
  
  // Fetch customer's URLs
  const { data: customerUrls } = useQuery({
    queryKey: ['customer-urls', customer?.id],
    queryFn: async () => {
      if (!customer?.id) return [];
      const { data } = await supabase
        .from('removal_urls')
        .select('*')
        .eq('customer_id', customer.id);
      return data || [];
    },
    enabled: !!customer?.id
  });

  if (!customer) return null;

  const isOnline = customer.id ? onlineUsers.has(customer.id) : false;
  const userLastSeen = customer.id ? lastSeen[customer.id] : null;

  return (
    <Sheet open={!!customer} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-sm w-full px-0">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="px-6 space-y-6">
            <div className="flex flex-col items-center text-center pt-6">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-white dark:border-[#1e1e1e]">
                  <AvatarImage src={customer.profile?.avatar_url} />
                  <AvatarFallback className="bg-[#e8e8e8] dark:bg-[#303032] text-[#5e5e5e] dark:text-[#FFFFFFA6] text-2xl">
                    {getUserInitials(customer.profile)}
                  </AvatarFallback>
                </Avatar>
                {customer.onboarding_completed && (
                  <div className="absolute bottom-0 right-0 bg-white dark:bg-[#1e1e1e] rounded-full p-1">
                    <BadgeCheck className="w-5 h-5 text-blue-500" />
                  </div>
                )}
              </div>
              
              <div className="mt-4 space-y-1">
                <h2 className="text-2xl font-semibold text-[#000000] dark:text-white">
                  {customer.profile?.display_name || 'Unnamed Customer'}
                </h2>
                <p className="text-sm text-[#000000A6] dark:text-[#FFFFFFA6]">
                  {customer.profile?.email || 'No email provided'}
                </p>
              </div>
            </div>

            {/* Customer Type & Subscription Tags */}
            <div className="flex gap-2 justify-center flex-wrap">
              <Badge 
                variant="secondary"
                className="bg-badge-subscription-bg dark:bg-badge-subscription-bg-dark text-badge-subscription-text hover:bg-badge-subscription-bg dark:hover:bg-badge-subscription-bg-dark py-1.5"
              >
                {customer.customer_type}
              </Badge>
              <SubscriptionBadge plan={customer.subscription_plan} />
            </div>
          </div>

          {/* Details Sections */}
          <div className="border-t border-[#eaeaea] dark:border-[#2e2e2e]">
            <div className="px-6 py-4 space-y-6">
              {/* Account Details */}
              <div>
                <h3 className="text-base font-medium text-[#000000] dark:text-[#FFFFFFA6] mb-3">
                  Account Details
                </h3>
                <div className="space-y-2">
                  <p className="text-sm flex justify-between">
                    <span className="text-[#000000] dark:text-[#FFFFFFA6]">Customer ID</span>
                    <span className="text-[#000000A6] dark:text-[#FFFFFFA6]">{customer.id}</span>
                  </p>
                  <p className="text-sm flex justify-between">
                    <span className="text-[#000000] dark:text-[#FFFFFFA6]">Created</span>
                    <span className="text-[#000000A6] dark:text-[#FFFFFFA6]">
                      {customer.created_at ? format(new Date(customer.created_at), 'PPP') : 'N/A'}
                    </span>
                  </p>
                  <p className="text-sm flex justify-between">
                    <span className="text-[#000000] dark:text-[#FFFFFFA6]">Status</span>
                    <span className="text-[#000000A6] dark:text-[#FFFFFFA6]">
                      {isOnline ? 'Online' : 'Offline'}
                    </span>
                  </p>
                  {!isOnline && userLastSeen && (
                    <p className="text-sm flex justify-between">
                      <span className="text-[#000000] dark:text-[#FFFFFFA6]">Last seen</span>
                      <span className="text-[#000000A6] dark:text-[#FFFFFFA6]">
                        {formatDistanceToNow(new Date(userLastSeen), { addSuffix: true })}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              {/* URLs Section */}
              <div>
                <h3 className="text-base font-medium text-[#000000] dark:text-[#FFFFFFA6] mb-3">
                  URL Submissions
                </h3>
                <div className="space-y-2">
                  <p className="text-sm flex justify-between">
                    <span className="text-[#000000] dark:text-[#FFFFFFA6]">Total URLs</span>
                    <span className="text-[#000000A6] dark:text-[#FFFFFFA6]">
                      {customerUrls?.length || 0}
                    </span>
                  </p>
                </div>
              </div>

              {/* Onboarding Status */}
              <div>
                <h3 className="text-base font-medium text-[#000000] dark:text-[#FFFFFFA6] mb-3">
                  Onboarding Status
                </h3>
                <div className="space-y-2">
                  <p className="text-sm flex justify-between">
                    <span className="text-[#000000] dark:text-[#FFFFFFA6]">Status</span>
                    <span className="text-[#000000A6] dark:text-[#FFFFFFA6]">
                      {customer.onboarding_completed ? 'Completed' : 'In Progress'}
                    </span>
                  </p>
                  {!customer.onboarding_completed && (
                    <p className="text-sm flex justify-between">
                      <span className="text-[#000000] dark:text-[#FFFFFFA6]">Current Step</span>
                      <span className="text-[#000000A6] dark:text-[#FFFFFFA6]">{customer.onboarding_step || 1}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
