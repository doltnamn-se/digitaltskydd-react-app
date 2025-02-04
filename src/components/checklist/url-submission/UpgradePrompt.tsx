import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface UpgradePromptProps {
  onSkip: () => void;
  isLoading: boolean;
}

export const UpgradePrompt = ({ onSkip, isLoading }: UpgradePromptProps) => {
  const { t, language } = useLanguage();
  
  return (
    <div className="space-y-4">
      <div className="text-center p-4 bg-[#e54d2e1a] dark:bg-[#e54d2e1a] rounded-lg">
        <p className="text-sm text-[#ca3214] dark:text-[#f16a50]">
          {t('url.no.plan')}
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <Button
          variant="default"
          onClick={() => window.open('https://buy.stripe.com/4gw2976Ww5yh92wcMW', '_blank')}
          className="w-full"
        >
          {language === 'sv' ? 'Uppgradera till 6 mån' : 'Upgrade to 6 mo'}
        </Button>
        <Button
          variant="default"
          onClick={() => window.open('https://buy.stripe.com/bIYfZXft26Cl92w3cn', '_blank')}
          className="w-full"
        >
          {language === 'sv' ? 'Uppgradera till 12 mån' : 'Upgrade to 12 mo'}
        </Button>
        <Button
          variant="outline"
          onClick={onSkip}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 
            (language === 'sv' ? 'Hoppar över...' : 'Skipping...') : 
            (language === 'sv' ? 'Hoppa över steg' : 'Skip this step')}
        </Button>
      </div>
    </div>
  );
};