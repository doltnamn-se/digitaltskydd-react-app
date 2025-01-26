import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PasswordUpdateForm } from "./PasswordUpdateForm";
import { HidingSitesSelection } from "./HidingSitesSelection";
import { UrlSubmission } from "./UrlSubmission";
import { PersonalInfoForm } from "./PersonalInfoForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, ArrowRight, Check, ChevronRight } from "lucide-react";
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
  const { t, language } = useLanguage();

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
          <Badge variant="outline" className="w-fit bg-black dark:bg-white text-white dark:text-black border-none font-medium">
            {t('step.number', { number: currentStep })}
          </Badge>
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold">
              {currentStep === 1 ? t('step.1.title') : 
               currentStep === 2 ? "Avindexering" : 
               currentStep === 3 ? t('step.3.title') : 
               t('step.4.title')}
            </h3>
            <p className="text-sm font-medium text-[#000000A6] dark:text-[#FFFFFFA6]">
              {currentStep === 1 ? t('set.password.description') :
               currentStep === 2 ? "Lägg in de länkar från Google du önskar ta bort" :
               currentStep === 3 ? t('step.urls.description') :
               t('step.info.description')}
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
                return <PasswordUpdateForm 
                  onComplete={() => {
                    handleStepComplete();
                    setCurrentStep(2);
                  }}
                  buttonClassName="w-full xl:w-1/4 lg:w-1/2"
                />;
              case 2:
                return <UrlSubmission onComplete={() => {
                  handleStepComplete();
                  setCurrentStep(3);
                }} />;
              case 3:
                return <HidingSitesSelection onComplete={() => {
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6 rounded-[4px] mb-6 dark:bg-[#1c1c1e] dark:border-[#232325]">
            <div className="space-y-8">
              {renderCurrentStep()}
              <div className="py-8">
                <Separator className="bg-[#e0e0e0] dark:bg-[#3a3a3b]" />
              </div>
              <div className="flex justify-between">
                {currentStep > 1 && (
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                    className="gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    {language === 'en' ? 'Back' : 'Tillbaka'}
                  </Button>
                )}
                {currentStep === 1 && <div />}
                <Button
                  onClick={() => setCurrentStep((prev) => Math.min(4, prev + 1))}
                  disabled={currentStep === 4}
                  className="gap-2"
                >
                  {language === 'en' ? `Step ${currentStep + 1}` : `Steg ${currentStep + 1}`}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6 rounded-[4px] dark:bg-[#1c1c1e] dark:border-[#232325]">
            <h2 className="text-lg font-semibold mb-4">{t('getting.started')}</h2>
            <div className="space-y-4">
              {[
                { step: 1, title: t('step.1.title'), description: t('step.password.description'), completed: checklistProgress?.password_updated },
                { step: 2, title: "Avindexering", description: "Lägg in de länkar från Google du önskar ta bort", completed: checklistProgress?.selected_sites?.length > 0 },
                { step: 3, title: t('step.3.title'), description: t('step.urls.description'), completed: checklistProgress?.removal_urls?.length > 0 },
                { step: 4, title: t('step.4.title'), description: t('step.info.description'), completed: checklistProgress?.address && checklistProgress?.personal_number },
              ].map((item) => (
                <div 
                  key={item.step} 
                  className={`flex items-center justify-between p-4 rounded-lg ${!item.completed ? 'bg-[#f8f8f7] dark:bg-[#2A2A2B]' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex-shrink-0 w-8 h-8 xl:w-10 xl:h-10 rounded-full ${item.completed ? 'opacity-40' : ''} bg-[#e0e0e0] dark:bg-[#3A3A3B] flex items-center justify-center`}>
                      <span className="text-xs xl:text-sm font-medium">{item.step}</span>
                    </div>
                    <div className={item.completed ? 'opacity-40' : ''}>
                      <p className="text-sm xl:text-base font-medium">{item.title}</p>
                      <p className="text-xs text-[#616166] dark:text-[#FFFFFFA6] font-medium hidden xl:block">{item.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {item.completed ? (
                      <div className="flex-shrink-0 w-8 h-8 xl:w-10 xl:h-10 rounded-full bg-[#219653] flex items-center justify-center">
                        <Check className="w-4 h-4 xl:w-6 xl:h-6 text-white" />
                      </div>
                    ) : (
                      <button 
                        onClick={() => setCurrentStep(item.step)}
                        className="flex-shrink-0 w-8 h-8 xl:w-10 xl:h-10 rounded-full hover:bg-gray-100 dark:hover:bg-[#3A3A3B] flex items-center justify-center transition-colors"
                      >
                        <ChevronRight className="w-4 h-4 xl:w-6 xl:h-6" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
