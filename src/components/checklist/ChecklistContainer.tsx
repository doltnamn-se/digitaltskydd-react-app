import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Separator } from "@/components/ui/separator";
import { StepProgress } from "./StepProgress";
import { StepContent } from "./StepContent";
import { StepNavigation } from "./StepNavigation";
import { useChecklistProgress } from "@/hooks/useChecklistProgress";
import { useChecklistItems } from "@/hooks/useChecklistItems";
import { supabase } from "@/integrations/supabase/client";

export const ChecklistContainer = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { t } = useLanguage();
  const { checklistProgress, handleStepComplete, calculateProgress, refetchProgress } = useChecklistProgress();
  const { checklistItems } = useChecklistItems();

  const handleGuideComplete = async (siteId: string) => {
    console.log('Completing guide for site:', siteId);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    const completedGuides = checklistProgress?.completed_guides || [];
    
    const { error } = await supabase
      .from('customer_checklist_progress')
      .update({ 
        completed_guides: [...completedGuides, siteId] 
      })
      .eq('customer_id', session.user.id);

    if (error) {
      console.error('Error updating completed guides:', error);
      return;
    }

    await refetchProgress();
  };

  const getTotalSteps = () => {
    const baseSteps = 4;
    const selectedSitesCount = checklistProgress?.selected_sites?.length || 0;
    return baseSteps + selectedSitesCount;
  };

  const getGuideForSite = (siteId: string) => {
    const guides = [
      {
        title: t('guide.eniro.title'),
        steps: [
          { text: 'https://uppdatera.eniro.se/person' },
          { text: t('guide.eniro.step1') },
          { text: t('guide.eniro.step2') },
          { text: t('guide.eniro.step3') }
        ]
      },
      {
        title: t('guide.mrkoll.title'),
        steps: [
          { text: 'https://mrkoll.se/om/andra-uppgifter/' },
          { text: t('guide.mrkoll.step1') },
          { text: t('guide.mrkoll.step2') }
        ]
      },
      {
        title: t('guide.hitta.title'),
        steps: [
          { text: 'https://www.hitta.se/kontakta-oss/ta-bort-kontaktsida' },
          { text: t('guide.hitta.step1') },
          { text: t('guide.hitta.step2') }
        ]
      },
      {
        title: t('guide.merinfo.title'),
        steps: [
          { text: 'https://www.merinfo.se/ta-bort-mina-uppgifter' },
          { text: t('guide.merinfo.step1') }
        ]
      },
      {
        title: t('guide.ratsit.title'),
        steps: [
          { text: 'https://www.ratsit.se/redigera/dolj' },
          { text: t('guide.ratsit.step1') },
          { text: t('guide.ratsit.step2') }
        ]
      },
      {
        title: t('guide.birthday.title'),
        steps: [
          { text: 'https://www.birthday.se/kontakta' },
          { text: t('guide.birthday.step1') },
          { text: t('guide.birthday.step2') }
        ]
      },
      {
        title: t('guide.upplysning.title'),
        steps: [
          { text: 'https://www.upplysning.se/kontakta-oss' },
          { text: t('guide.upplysning.step1') },
          { text: t('guide.upplysning.step2') }
        ]
      }
    ];

    return guides.find(guide => guide.title.toLowerCase().includes(siteId.toLowerCase()));
  };

  const onStepCompleted = async () => {
    console.log('Step completed, current step:', currentStep);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    // Update the progress in the database based on the current step
    const updateData: any = {};
    
    switch (currentStep) {
      case 1:
        updateData.password_updated = true;
        break;
      case 2:
        // For URL submission step, handled in UrlSubmission component
        break;
      case 3:
        // For site selection step, handled in HidingSitesSelection component
        break;
      default:
        // For guide steps, no specific updates needed here
        break;
    }

    if (Object.keys(updateData).length > 0) {
      const { error } = await supabase
        .from('customer_checklist_progress')
        .update(updateData)
        .eq('customer_id', session.user.id);

      if (error) {
        console.error('Error updating checklist progress:', error);
        return;
      }
    }

    await handleStepComplete();
    await refetchProgress();
    
    // Handle step progression
    const totalSteps = getTotalSteps();
    if (currentStep < totalSteps) {
      if (currentStep === 3) {
        const selectedSites = checklistProgress?.selected_sites || [];
        if (selectedSites.length > 0) {
          console.log('Moving to first guide step (4)');
          setCurrentStep(4);
        } else {
          console.log('No sites selected, moving to final step');
          setCurrentStep(totalSteps);
        }
      } else if (currentStep > 3) {
        // For guide steps
        const selectedSites = checklistProgress?.selected_sites || [];
        const completedGuides = checklistProgress?.completed_guides || [];
        const currentGuideIndex = currentStep - 4;
        
        if (currentGuideIndex < selectedSites.length) {
          const currentSite = selectedSites[currentGuideIndex];
          if (completedGuides.includes(currentSite)) {
            // Move to next guide step or final step
            const nextStep = currentStep + 1;
            console.log('Guide completed, moving to step:', nextStep);
            setCurrentStep(nextStep);
          } else {
            console.log('Current guide not completed yet, staying on step:', currentStep);
          }
        } else {
          // All guides completed, move to final step
          console.log('All guides completed, moving to final step');
          setCurrentStep(totalSteps);
        }
      } else {
        // For steps 1-2
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  return (
    <div className="space-y-6">
      <StepProgress progress={calculateProgress()} />
      <div className="space-y-8">
        <div className="step-content-wrapper bg-white dark:bg-[#1C1C1D] rounded-lg p-6">
          {[...Array(getTotalSteps())].map((_, index) => (
            <div 
              key={index + 1}
              data-step={index + 1}
              style={{ display: currentStep === index + 1 ? 'block' : 'none' }}
            >
              <StepContent
                currentStep={index + 1}
                selectedSites={checklistProgress?.selected_sites || []}
                completedGuides={checklistProgress?.completed_guides}
                onGuideComplete={handleGuideComplete}
                onStepComplete={onStepCompleted}
                checklistItems={checklistItems || []}
                getGuideForSite={getGuideForSite}
              />
            </div>
          ))}
        </div>
        <div className="py-8">
          <Separator className="bg-[#e0e0e0] dark:bg-[#3a3a3b]" />
        </div>
        <StepNavigation
          currentStep={currentStep}
          totalSteps={getTotalSteps()}
          onStepChange={setCurrentStep}
        />
      </div>
    </div>
  );
};
