import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import confetti from 'canvas-confetti';

export const useChecklistProgress = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: checklistProgress, refetch: refetchProgress } = useQuery({
    queryKey: ['checklist-progress'],
    queryFn: async () => {
      console.log('Fetching checklist progress...');
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error('No user session');

      // Fetch both customer and progress data
      const [{ data: customerData, error: customerError }, { data: progressData, error: progressError }] = await Promise.all([
        supabase
          .from('customers')
          .select('checklist_step, has_address_alert')
          .eq('id', session.user.id)
          .single(),
        supabase
          .from('customer_checklist_progress')
          .select('*')
          .eq('customer_id', session.user.id)
          .maybeSingle()
      ]);
      
      if (customerError) {
        console.error('Error fetching customer data:', customerError);
        throw customerError;
      }

      if (progressError) {
        console.error('Error fetching checklist progress:', progressError);
        throw progressError;
      }

      if (!progressData) {
        const { data: newProgress, error: insertError } = await supabase
          .from('customer_checklist_progress')
          .insert([{ customer_id: session.user.id }])
          .select()
          .single();

        if (insertError) {
          console.error('Error creating checklist progress:', insertError);
          throw insertError;
        }

        return { 
          ...newProgress, 
          checklist_step: customerData?.checklist_step || 1,
          has_address_alert: customerData?.has_address_alert 
        };
      }
      
      console.log('Raw checklist progress data:', progressData);
      console.log('Customer data:', customerData);

      // Merge progress data with customer data
      return { 
        ...progressData, 
        checklist_step: customerData?.checklist_step || 1,
        has_address_alert: customerData?.has_address_alert 
      };
    }
  });

  const calculateProgress = () => {
    if (!checklistProgress) {
      console.log('No checklist progress data available');
      return 0;
    }
    
    console.log('Calculating progress with data:', checklistProgress);
    
    const totalSteps = 4;
    let completedSteps = 0;
    
    // Step 1: Password updated
    if (checklistProgress.password_updated) {
      console.log('Step 1 completed: Password updated');
      completedSteps++;
    } else {
      console.log('Step 1 not completed: Password not updated');
    }
    
    // Step 2: URLs submitted or skipped
    if (checklistProgress.removal_urls && 
        (checklistProgress.removal_urls.length > 0 || 
         checklistProgress.removal_urls.includes('skipped') ||
         checklistProgress.checklist_step > 2)) {
      console.log('Step 2 completed: URLs submitted or skipped');
      completedSteps++;
    } else {
      console.log('Step 2 not completed: No URLs submitted or skipped', {
        urls: checklistProgress.removal_urls
      });
    }
    
    // Step 3: Sites selected - now also considers when no sites are selected (none option)
    if ((checklistProgress.selected_sites?.length > 0) || 
        (Array.isArray(checklistProgress.completed_guides) && 
         checklistProgress.completed_guides.length === HIDING_SITES.length)) {
      console.log('Step 3 completed: Sites selected:', checklistProgress.selected_sites);
      completedSteps++;
    } else {
      console.log('Step 3 not completed: No sites selected');
    }
    
    // Step 4: Final step (address)
    if (checklistProgress.street_address && 
        checklistProgress.postal_code && 
        checklistProgress.city) {
      console.log('Step 4 completed: Address provided', {
        street: checklistProgress.street_address,
        postal: checklistProgress.postal_code,
        city: checklistProgress.city
      });
      completedSteps++;
    } else {
      console.log('Step 4 not completed: Address not provided', {
        street: checklistProgress.street_address,
        postal: checklistProgress.postal_code,
        city: checklistProgress.city
      });
    }

    const progress = Math.round((completedSteps / totalSteps) * 100);
    console.log('Progress calculation:', {
      completedSteps,
      totalSteps,
      progress,
      checklistProgress
    });
    
    return progress;
  };

  return {
    checklistProgress,
    refetchProgress,
    calculateProgress
  };
};

// Constants
const HIDING_SITES = [
  'eniro',
  'hitta',
  'mrkoll',
  'merinfo',
  'ratsit',
  'birthday',
  'upplysning'
];