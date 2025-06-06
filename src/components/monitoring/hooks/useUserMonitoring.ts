
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from "@/integrations/supabase/client";
import { useUserProfile } from '@/hooks/useUserProfile';
import { useMonitoringUrls } from './useMonitoringUrls';

export const useUserMonitoring = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const { userProfile } = useUserProfile();
  const [userId, setUserId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  useEffect(() => {
    const fetchUserId = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUserId(data.user.id);
      }
    };
    fetchUserId();
  }, []);
  
  // Get monitoring URLs for the user
  const { 
    monitoringUrls, 
    handleUpdateStatus 
  } = useMonitoringUrls(userId || undefined);

  // Filter to get only pending URLs
  const pendingUrls = monitoringUrls.filter(url => url.status === 'pending');

  const handleApproveUrl = async (urlId: string) => {
    try {
      setIsProcessing(true);
      console.log(`Approving URL ${urlId}`);
      await handleUpdateStatus(urlId, 'approved');
    } catch (error) {
      console.error("Error approving URL:", error);
      toast({
        title: t('error'),
        description: t('monitoring.url.error.approve'),
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectUrl = async (urlId: string) => {
    try {
      setIsProcessing(true);
      console.log(`Rejecting URL ${urlId}`);
      await handleUpdateStatus(urlId, 'rejected');
    } catch (error) {
      console.error("Error rejecting URL:", error);
      toast({
        title: t('error'),
        description: t('monitoring.url.error.reject'),
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const displayName = userProfile?.display_name || '';
  const firstNameOnly = displayName.split(' ')[0];

  return {
    userId,
    pendingUrls,
    isProcessing,
    handleApproveUrl,
    handleRejectUrl,
    displayName,
    firstNameOnly
  };
};
