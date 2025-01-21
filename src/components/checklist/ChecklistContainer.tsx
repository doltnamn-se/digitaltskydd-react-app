import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PasswordUpdateForm } from "./PasswordUpdateForm";
import { HidingSitesSelection } from "./HidingSitesSelection";
import { UrlSubmission } from "./UrlSubmission";
import { PersonalInfoForm } from "./PersonalInfoForm";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Check } from "lucide-react";
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
  const [progress, setProgress] = useState(0);
  const queryClient = useQueryClient();

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
    },
    refetchInterval: 0, // Disable automatic refetching
    staleTime: 0, // Consider data always stale
  });

  // Function to handle step completion
  const handleStepComplete = async () => {
    console.log('Step completed, refetching progress...');
    await refetchProgress();
    await queryClient.invalidateQueries({ queryKey: ['checklist-progress'] });
  };

  useEffect(() => {
    if (checklistProgress) {
      let completedSteps = 0;
      if (checklistProgress.password_updated) completedSteps++;
      if (checklistProgress.selected_sites?.length > 0) completedSteps++;
      if (checklistProgress.removal_urls?.length > 0) completedSteps++;
      if (checklistProgress.address && checklistProgress.personal_number) completedSteps++;
      
      const newProgress = (completedSteps / 4) * 100;
      setProgress(newProgress);
      
      if (newProgress === 100 && !checklistProgress.completed_at) {
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
  }, [checklistProgress, toast]);

  const renderCurrentStep = () => {
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
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Your Progress</h2>
          <span className="text-sm text-gray-500">{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="grid gap-4">
        {checklistItems?.map((item, index) => (
          <div
            key={item.id}
            className={`p-4 border rounded-lg ${
              index + 1 === currentStep
                ? 'border-black dark:border-white'
                : 'border-gray-200 dark:border-gray-800'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium flex items-center gap-2">
                {index + 1 < currentStep && (
                  <Check className="h-4 w-4 text-green-500" />
                )}
                {item.title}
              </h3>
              {item.requires_subscription_plan && (
                <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  {item.requires_subscription_plan.join(', ')}
                </span>
              )}
            </div>
            {item.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {item.description}
              </p>
            )}
            {index + 1 === currentStep && renderCurrentStep()}
          </div>
        ))}
      </div>

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