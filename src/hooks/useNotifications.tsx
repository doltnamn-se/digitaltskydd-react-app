
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { pushNotificationService } from '@/services/pushNotificationService';
import { isNativePlatform } from '@/capacitor';

export type Notification = {
  id: string;
  user_id: string;
  title: string;
  message: string;
  read: boolean;
  type: string;
  created_at: string;
};

export const useNotifications = () => {
  const { toast } = useToast();
  const [unreadCount, setUnreadCount] = useState(0);

  // Initialize push notifications on mobile devices with better error handling
  useEffect(() => {
    const initPushNotifications = async () => {
      if (isNativePlatform()) {
        try {
          console.log('Initializing push notifications from useNotifications hook');
          await pushNotificationService.register();
          
          // Debug: Check if tokens are registered
          setTimeout(async () => {
            const tokens = await pushNotificationService.debugTokens();
            console.log('Debug - Available push tokens:', tokens);
          }, 3000);
        } catch (err) {
          console.error('Error registering for push notifications:', err);
        }
      }
    };
    
    initPushNotifications();
  }, []);

  // Fetch notifications
  const { data: notifications = [], refetch } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      console.log('Fetching notifications...');
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        console.log('No active session, returning empty notifications array');
        return [];
      }

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notifications:', error);
        return [];
      }

      console.log('Notifications fetched:', data);
      return data as Notification[];
    },
  });

  // Update unread count whenever notifications change
  useEffect(() => {
    if (notifications) {
      const count = notifications.filter(n => !n.read).length;
      setUnreadCount(count);
      console.log('Unread notifications count:', count);
    }
  }, [notifications]);

  // Subscribe to real-time notifications with improved debugging
  useEffect(() => {
    console.log('Setting up notifications subscription...');
    const channel = supabase
      .channel('notifications-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
        },
        (payload) => {
          console.log('New notification received via realtime:', payload);
          toast({
            title: payload.new.title,
            description: payload.new.message,
          });
          refetch();
          
          // If on mobile, we manually trigger push notification service check
          if (isNativePlatform()) {
            console.log('On mobile device - checking push notification setup');
            pushNotificationService.debugTokens();
          }
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up notifications subscription...');
      supabase.removeChannel(channel);
    };
  }, [toast, refetch]);

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    // Skip marking as read for checklist notifications which are virtual
    if (notificationId.startsWith('checklist-')) {
      return true;
    }

    console.log('Marking notification as read:', notificationId);
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (error) {
      console.error('Error marking notification as read:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark notification as read',
        variant: 'destructive',
      });
      return false;
    }

    console.log('Notification marked as read successfully');
    refetch();
    return true;
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    console.log('Marking all notifications as read');
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('read', false);

    if (error) {
      console.error('Error marking all notifications as read:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark all notifications as read',
        variant: 'destructive',
      });
      return false;
    }

    console.log('All notifications marked as read successfully');
    refetch();
    return true;
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  };
};
