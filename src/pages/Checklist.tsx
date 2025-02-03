import { useLanguage, LanguageProvider } from "@/contexts/LanguageContext";
import { ChecklistContainer } from "@/components/checklist/ChecklistContainer";
import { Card } from "@/components/ui/card";
import { useChecklistProgress } from "@/hooks/useChecklistProgress";
import { useChecklistItems } from "@/hooks/useChecklistItems";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect } from "react";
import { ChecklistProgress } from "@/components/checklist/ChecklistProgress";
import { ChecklistSteps } from "@/components/checklist/ChecklistSteps";
import { BadgeCheck } from "lucide-react";
import { AuthLogo } from "@/components/auth/AuthLogo";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { ThemeToggle } from "@/components/nav/ThemeToggle";
import { TooltipProvider } from "@/components/ui/tooltip";

const ChecklistContent = () => {
  const { t, language } = useLanguage();
  const isMobile = useIsMobile();
  const { checklistProgress, calculateProgress } = useChecklistProgress();
  const { checklistItems } = useChecklistItems();

  useEffect(() => {
    document.title = language === 'sv' ? 
      "Checklista | Doltnamn.se" : 
      "Checklist | Doltnamn.se";
  }, [language]);

  const handleStepClick = (stepNumber: number) => {
    console.log('Clicking step:', stepNumber);
    const checklistContainer = document.querySelector('.step-content-wrapper');
    if (!checklistContainer) {
      console.log('Container not found');
      return;
    }

    const stepElement = checklistContainer.querySelector(`[data-step="${stepNumber}"]`);
    if (stepElement) {
      console.log('Found step element, scrolling to it');
      stepElement.scrollIntoView({ behavior: 'smooth' });
      
      const containerInstance = document.querySelector('.checklist-component') as any;
      if (containerInstance && containerInstance.__reactFiber$) {
        const instance = containerInstance.__reactFiber$.child?.stateNode;
        if (instance && instance.setCurrentStep) {
          console.log('Updating current step to:', stepNumber);
          instance.setCurrentStep(stepNumber);
        } else {
          console.log('setCurrentStep not found on instance');
        }
      } else {
        console.log('Container instance not found');
      }
    } else {
      console.log('Step element not found');
    }
  };

  const progress = calculateProgress();
  const totalSteps = 4;

  return (
    <div className="min-h-screen bg-[#f4f4f4] dark:bg-[#161618] p-6 md:p-12">
      <div className="max-w-[1400px] mx-auto">
        <TooltipProvider>
          <div className="flex justify-between items-center mb-6">
            <AuthLogo />
            <div className="flex items-center gap-2">
              <LanguageSwitch />
              <ThemeToggle />
            </div>
          </div>

          <div className="flex flex-col items-center mb-6">
            <div className="flex flex-wrap items-center justify-center gap-8">
              <h1 className="text-2xl font-black tracking-[-.416px] text-[#000000] dark:text-white">
                {t('nav.checklist')}
              </h1>
              <ChecklistProgress progress={progress} />
              {!isMobile && progress !== 100 && (
                <span className="text-sm font-medium text-[#000000A6] dark:text-[#FFFFFFA6]">
                  {t('step.progress', { 
                    current: Math.ceil(progress / 25),
                    total: totalSteps
                  })}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <Card className="p-6 rounded-[4px] dark:bg-[#1c1c1e] dark:border-[#232325]">
              <ChecklistSteps 
                checklistProgress={checklistProgress}
                onStepClick={handleStepClick}
              />
            </Card>

            <Card className="relative p-6 rounded-[4px] dark:bg-[#1c1c1e] dark:border-[#232325]">
              <div className="space-y-8">
                <div className="checklist-component">
                  <ChecklistContainer />
                </div>
              </div>
              {progress === 100 && (
                <div className="absolute inset-0 z-10 backdrop-blur-sm bg-white/30 dark:bg-black/30 rounded-[4px] flex items-center justify-center">
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="w-6 h-6" />
                    <p className="text-lg font-black">
                      {language === 'sv' ? 'Du är färdig med checklistan' : 'You have completed the checklist'}
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </TooltipProvider>
      </div>
    </div>
  );
};

const Checklist = () => {
  return (
    <LanguageProvider>
      <ChecklistContent />
    </LanguageProvider>
  );
};

export default Checklist;
