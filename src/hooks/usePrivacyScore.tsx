
import { useChecklistProgress } from "@/hooks/useChecklistProgress";
import { useGuideData } from "@/hooks/useGuideData";
import { useIncomingUrls } from "@/hooks/useIncomingUrls";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const usePrivacyScore = () => {
  const { checklistProgress, calculateProgress: calculateChecklistProgress } = useChecklistProgress();
  const { getGuides } = useGuideData();
  const { incomingUrls } = useIncomingUrls();
  const allGuides = getGuides();

  const { data: subscriptionPlan } = useQuery({
    queryKey: ['subscription-plan'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return null;

      const { data: customer } = await supabase
        .from('customers')
        .select('subscription_plan')
        .eq('id', session.user.id)
        .single();

      return customer?.subscription_plan;
    }
  });

  const calculateScore = () => {
    // Initialize weights based on subscription plan
    let weights = {
      checklist: subscriptionPlan === '1_month' ? 0.3333 : 0.25,
      guides: subscriptionPlan === '1_month' ? 0.3333 : 0.25,
      address: subscriptionPlan === '1_month' ? 0.3333 : 0.25,
      urls: subscriptionPlan === '1_month' ? 0 : 0.25
    };

    // Calculate individual scores
    const scores = {
      checklist: calculateChecklistProgress() / 100,
      guides: allGuides.length > 0 ? 
        (checklistProgress?.completed_guides?.length || 0) / allGuides.length : 1,
      address: checklistProgress?.has_address_alert ? 1 : 0,
      urls: calculateUrlScore()
    };

    // Calculate weighted total
    const totalScore = Object.keys(weights).reduce((total, key) => {
      return total + (scores[key as keyof typeof scores] * weights[key as keyof typeof weights]);
    }, 0);

    return {
      total: Math.round(totalScore * 100),
      individual: {
        checklist: Math.round(scores.checklist * 100),
        guides: Math.round(scores.guides * 100),
        address: Math.round(scores.address * 100),
        urls: Math.round(scores.urls * 100)
      }
    };
  };

  const calculateUrlScore = () => {
    if (subscriptionPlan === '1_month') return 1; // Not applicable for 1-month plan
    if (!incomingUrls?.length) return 1; // No URLs submitted is considered complete

    // Calculate based on URL statuses
    const completedUrls = incomingUrls.filter(url => 
      url.status === 'removal_approved'
    ).length;

    return completedUrls / incomingUrls.length;
  };

  return { calculateScore };
};
