import { useLanguage } from "@/contexts/LanguageContext";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type StatusStepperProps = {
  currentStatus: string;
};

const STEPS = ['received', 'in_progress', 'request_submitted', 'completed'] as const;

export const StatusStepper = ({ currentStatus }: StatusStepperProps) => {
  const { t } = useLanguage();

  console.log('Current status received:', currentStatus); // Debug log

  const getStepIndex = (status: string) => {
    // Map the database status to our step status
    let mappedStatus = status;
    switch (status) {
      case 'case_started':
        mappedStatus = 'in_progress';
        break;
      case 'removal_approved':
        mappedStatus = 'completed';
        break;
      default:
        mappedStatus = status;
    }

    console.log('Mapped status:', mappedStatus); // Debug log
    const index = STEPS.indexOf(mappedStatus as typeof STEPS[number]);
    console.log('Step index:', index); // Debug log
    
    return index >= 0 ? index : 0;
  };

  const currentStepIndex = getStepIndex(currentStatus);
  const progressPercentage = ((currentStepIndex + 1) * 100) / STEPS.length;
  
  console.log('Progress percentage:', progressPercentage); // Debug log

  const getStatusText = (status: string) => {
    switch (status) {
      case 'received':
        return t('deindexing.status.received');
      case 'in_progress':
        return t('deindexing.status.case.started');
      case 'request_submitted':
        return t('deindexing.status.request.submitted');
      case 'completed':
        return t('deindexing.status.removal.approved');
      default:
        return t('deindexing.status.received');
    }
  };

  return (
    <div className="w-full">
      <style>
        {`
          @keyframes moveStripes {
            0% { background-position: 0 0; }
            100% { background-position: -10px 0; }
          }
          .deindexing-progress {
            background-color: #97ee88;
          }
          .deindexing-progress-indicator {
            position: relative;
            overflow: hidden;
          }
          .deindexing-progress-indicator::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #00540c;
            z-index: 1;
            clip-path: polygon(0 0, calc(${(currentStepIndex + 0.5) * 25}%) 0, calc(${(currentStepIndex + 0.5) * 25}%) 100%, 0 100%);
          }
          .deindexing-progress-indicator::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(
              -45deg,
              #000000 25%,
              #1a1a1a 25%,
              #1a1a1a 50%,
              #000000 50%,
              #000000 75%,
              #1a1a1a 75%,
              #1a1a1a 100%
            );
            background-size: 7px 7px;
            animation: moveStripes 1.8s linear infinite;
          }
        `}
      </style>
      <div className="relative">
        <Progress 
          value={progressPercentage} 
          className="h-3 rounded-full overflow-hidden mb-4 deindexing-progress"
          indicatorClassName="deindexing-progress-indicator dark:bg-white"
        />
        <div 
          className="absolute top-1/2 h-3 flex items-center -translate-y-1/2" 
          style={{ left: `${progressPercentage}%`, transform: 'translate(-50%, -50%)' }}
        >
          <div className="w-6 h-6 rounded-full bg-[#00540c] dark:bg-white border-4 border-white dark:border-[#1c1c1e] shadow-[0_0_15px_rgba(0,0,0,0.25)] dark:shadow-[0_0_15px_rgba(255,255,255,0.25)]"></div>
        </div>
      </div>
      <div className="flex justify-between mt-2">
        {STEPS.map((step, index) => {
          const isActive = index <= currentStepIndex;
          const isCurrentStep = index === currentStepIndex;
          return (
            <div 
              key={step}
              className={cn(
                "text-xs text-center",
                isActive ? "text-black dark:text-white" : "text-[#616166]",
                isCurrentStep ? "font-medium" : "",
                "w-[25%]"
              )}
            >
              {getStatusText(step)}
            </div>
          );
        })}
      </div>
    </div>
  );
};