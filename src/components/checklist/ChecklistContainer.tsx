import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PasswordUpdateForm } from "./PasswordUpdateForm";
import { HidingSitesSelection } from "./HidingSitesSelection";
import { UrlSubmission } from "./UrlSubmission";
import { PersonalInfoForm } from "./PersonalInfoForm";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import confetti from 'canvas-confetti';

interface ChecklistProgress {
  password_updated: boolean;
  selected_sites: string[];
  removal_urls: string[];
  address: string | null;
  is_address_hidden: boolean;
  personal_number: string | null;
  completed_at: string | null;
}

export const ChecklistContainer = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  const { data: checklistItems } = useQuery({
    queryKey: ['checklist-items'],
    queryFn: async () => {
      console.log('Fetching checklist items...');
      const { data, error } = await supabase
        .from('checklist_items')
        .select('*')
        .order('order_index');
      
      if (error) {
        console.error('Error fetching checklist items:', error);
        throw error;
      }
      
      console.log('Checklist items fetched:', data);
      return data;
    }
  });

  const { data: checklistProgress, refetch: refetchProgress } = useQuery({
    queryKey: ['checklist-progress'],
    queryFn: async () => {
      console.log('Fetching checklist progress...');
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error('No user session');

      const { data, error } = await supabase
        .from('customer_checklist_progress')
        .select('*')
        .eq('customer_id', session.user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching checklist progress:', error);
        throw error;
      }

      if (!data) {
        const { data: newProgress, error: insertError } = await supabase
          .from('customer_checklist_progress')
          .insert([{ customer_id: session.user.id }])
          .select()
          .single();

        if (insertError) {
          console.error('Error creating checklist progress:', insertError);
          throw insertError;
        }

        return newProgress as ChecklistProgress;
      }
      
      console.log('Checklist progress fetched:', data);
      return data as ChecklistProgress;
    }
  });

  const handleStepComplete = async () => {
    console.log('Step completed, refetching progress...');
    await refetchProgress();
    await queryClient.invalidateQueries({ queryKey: ['checklist-progress'] });
    
    if (checklistProgress && !checklistProgress.completed_at) {
      let completedSteps = 0;
      if (checklistProgress.password_updated) completedSteps++;
      if (checklistProgress.selected_sites?.length > 0) completedSteps++;
      if (checklistProgress.removal_urls?.length > 0) completedSteps++;
      if (checklistProgress.address && checklistProgress.personal_number) completedSteps++;
      
      if (completedSteps === 4) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        
        toast({
          title: "Congratulations! 🎉",
          description: "You've completed all the checklist items!",
        });
      }
    }
  };

  const renderCurrentStep = () => {
    const currentItem = checklistItems?.[currentStep - 1];
    if (!currentItem) return null;

    return (
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-[#000000A6]">{t('step.number', { number: currentStep })}</span>
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold">{t('set.password')}</h3>
            <p className="text-sm text-gray-500 font-medium">
              {t('set.password.description')}
            </p>
            {currentItem.requires_subscription_plan && (
              <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded w-fit">
                {currentItem.requires_subscription_plan.join(', ')}
              </span>
            )}
          </div>
        </div>
        <div className="pt-4">
          {(() => {
            switch (currentStep) {
              case 1:
                return <PasswordUpdateForm onComplete={() => {
                  handleStepComplete();
                  setCurrentStep(2);
                }} />;
              case 2:
                return <HidingSitesSelection onComplete={() => {
                  handleStepComplete();
                  setCurrentStep(3);
                }} />;
              case 3:
                return <UrlSubmission onComplete={() => {
                  handleStepComplete();
                  setCurrentStep(4);
                }} />;
              case 4:
                return <PersonalInfoForm onComplete={handleStepComplete} />;
              default:
                return null;
            }
          })()}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {renderCurrentStep()}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
          disabled={currentStep === 1}
        >
          Previous
        </Button>
        <Button
          onClick={() => setCurrentStep((prev) => Math.min(4, prev + 1))}
          disabled={currentStep === 4}
        >
          Next
        </Button>
      </div>
    </div>
  );
};