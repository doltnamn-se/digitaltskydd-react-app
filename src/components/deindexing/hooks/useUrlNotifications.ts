import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

export const useUrlNotifications = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();

  const createStatusNotification = async (customerId: string) => {
    console.log('useUrlNotifications - Creating status notification:', { 
      customerId,
      currentLanguage: language,
      translatedTitle: t('deindexing.status.notification.title'),
      translatedMessage: t('deindexing.status.notification.message')
    });
    
    try {
      // First check if there's a recent notification of the same type
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
      const { data: recentNotifications, error: checkError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', customerId)
        .eq('type', 'removal')
        .gte('created_at', tenMinutesAgo);

      if (checkError) {
        console.error('useUrlNotifications - Error checking recent notifications:', checkError);
        throw checkError;
      }

      console.log('useUrlNotifications - Recent notifications found:', recentNotifications?.length || 0);

      // Only create a new notification if there isn't a recent one
      if (!recentNotifications || recentNotifications.length === 0) {
        const { error: notificationError } = await supabase
          .from('notifications')
          .insert({
            user_id: customerId,
            title: t('deindexing.status.notification.title'),
            message: t('deindexing.status.notification.message'),
            type: 'removal',
            read: false
          });

        if (notificationError) {
          console.error('useUrlNotifications - Error creating notification:', notificationError);
          throw notificationError;
        }

        console.log('useUrlNotifications - Notification created successfully');
      } else {
        console.log('useUrlNotifications - Skipping notification creation due to recent similar notification');
      }
    } catch (error: any) {
      console.error('useUrlNotifications - Error in createStatusNotification:', error);
      throw error;
    }
  };

  const showErrorToast = () => {
    toast({
      title: t('error'),
      description: t('error.update.status'),
      variant: "destructive",
    });
  };

  return {
    createStatusNotification,
    showErrorToast
  };
};