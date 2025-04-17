
import React from "react";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { StatusTable } from "./StatusTable";
import { useGuideService } from "@/services/guideService";
import { supabase } from "@/integrations/supabase/client";
import { useUrlNotifications } from "@/components/deindexing/hooks/useUrlNotifications";
import { useToast } from "@/hooks/use-toast";

interface SiteStatus {
  site_name: string;
  status: string;
}

interface StatusCardProps {
  siteStatuses: SiteStatus[];
  isLoading: boolean;
}

export const StatusCard: React.FC<StatusCardProps> = ({ 
  siteStatuses,
  isLoading
}) => {
  const { language, t } = useLanguage();
  const { getGuideForSite } = useGuideService();
  const { createStatusNotification } = useUrlNotifications();
  const { toast } = useToast();

  const sites = [
    { name: 'Mrkoll', icon: '/lovable-uploads/logo-icon-mrkoll.webp' },
    { name: 'Ratsit', icon: '/lovable-uploads/logo-icon-ratsit.webp' },
    { name: 'Hitta', icon: '/lovable-uploads/logo-icon-hittase.webp' },
    { name: 'Merinfo', icon: '/lovable-uploads/logo-icon-merinfo.webp' },
    { name: 'Eniro', icon: '/lovable-uploads/logo-icon-eniro.webp' },
    { name: 'Birthday', icon: '/lovable-uploads/logo-icon-birthdayse.webp' },
  ];

  const updateSiteStatus = async (siteName: string, newStatus: string) => {
    try {
      console.log(`Starting updateSiteStatus for ${siteName} to ${newStatus}`);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        console.error('No authenticated user found');
        return false;
      }

      const customerId = session.user.id;
      console.log(`Customer ID: ${customerId}`);
      
      // Check if there's an existing status entry
      const { data: existingStatus, error: queryError } = await supabase
        .from('customer_site_statuses')
        .select('id')
        .eq('customer_id', customerId)
        .eq('site_name', siteName)
        .maybeSingle();

      if (queryError) {
        console.error('Error querying existing status:', queryError);
        return false;
      }

      console.log('Existing status entry:', existingStatus);

      let result;
      
      // Try to do the update with a simpler approach first (to diagnose permissions issues)
      // Log this attempt explicitly
      if (existingStatus) {
        // Update existing status
        console.log(`Updating existing status entry for ${siteName} to ${newStatus}`);
        result = await supabase
          .from('customer_site_statuses')
          .update({ 
            status: newStatus,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingStatus.id)
          .select();
      } else {
        // Create new status
        console.log(`Creating new status entry for ${siteName} with status ${newStatus}`);
        result = await supabase
          .from('customer_site_statuses')
          .insert({
            customer_id: customerId,
            site_name: siteName,
            status: newStatus
          })
          .select();
      }

      if (result.error) {
        console.error('Error updating site status:', result.error);
        
        // Check if it's a permissions error and show detailed error
        if (result.error.code === '42501' || 
            result.error.message.includes('permission') || 
            result.error.code === 'PGRST116') {
          console.error('Permission denied when updating site status. This is likely due to RLS policies.');
          toast({
            title: t('error.update.status'),
            description: 'Permission denied. You may not have rights to update status.',
            variant: 'destructive',
          });
          return false;
        }
        return false;
      }

      if (!result.data || result.data.length === 0) {
        console.error('No data returned from update operation. Operation may have failed silently.');
        return false;
      }

      console.log('Status update successful:', result.data);
      
      // Create notification for admin - since we've successfully updated the status
      try {
        // Fetch all admin users
        const { data: admins, error: adminsError } = await supabase
          .from('profiles')
          .select('id')
          .eq('role', 'super_admin');
        
        if (adminsError) {
          console.error('Error fetching admins:', adminsError);
          return true; // Continue even if admin notification fails
        }
        
        console.log('Found admins:', admins);
        
        if (admins && admins.length > 0) {
          const adminId = admins[0].id;
          const notificationTitle = language === 'sv' ? 
            'Status uppdaterad av användare' : 
            'Status updated by user';
          const notificationMessage = language === 'sv' ? 
            `${siteName} status har ändrats till "Granskar" av en användare` : 
            `${siteName} status has been changed to "Reviewing" by a user`;
          
          console.log(`Creating notification for admin ${adminId}`);
          
          const { data: notification, error: notifError } = await supabase
            .from('notifications')
            .insert({
              user_id: adminId,
              title: notificationTitle,
              message: notificationMessage,
              type: 'status_change'
            })
            .select();
            
          if (notifError) {
            console.error('Failed to create admin notification:', notifError);
          } else {
            console.log('Admin notification created successfully:', notification);
          }
        }
        
        return true;
      } catch (notifError) {
        console.error('Failed to create admin notification:', notifError);
        return true; // Continue even if admin notification fails
      }
      
    } catch (error) {
      console.error('Error updating site status:', error);
      return false;
    }
  };

  const handleRemoveSite = async (siteName: string) => {
    console.log(`Handling remove for site: ${siteName}`);
    
    // Get the guide URL and open it in a new tab
    const guide = getGuideForSite(siteName.toLowerCase());
    if (guide?.steps[0]?.text) {
      window.open(guide.steps[0].text, '_blank');
    }
    
    // This needs to happen before the window.open to ensure it registers
    // Update the status from "Synlig" to "Granskar"
    const success = await updateSiteStatus(siteName, 'Granskar');
    console.log(`Status update for ${siteName} success:`, success);
    
    // If status update was successful, trigger a UI refresh
    if (success) {
      // We will now rely on the real-time subscription to update the UI
      console.log('Status update was successful, UI should update via subscription');
    }
  };

  return (
    <Card className="bg-white dark:bg-[#1c1c1e] p-4 md:p-6 rounded-[4px] shadow-sm border border-[#e5e7eb] dark:border-[#232325] transition-colors duration-200">
      <div>
        <h2 className="text-lg font-semibold">
          {language === 'sv' ? 'Status' : 'Status'}
        </h2>
        <p className="text-[#000000A6] dark:text-[#FFFFFFA6] font-medium text-sm mb-6 md:mb-10">
          {language === 'sv' ? 'Din synlighet på upplysningssidor' : 'Your visibility on search sites'}
        </p>
      </div>
      <div className="mt-2">
        <StatusTable 
          siteStatuses={siteStatuses} 
          sites={sites} 
          onRemoveSite={handleRemoveSite} 
        />
      </div>
    </Card>
  );
};
