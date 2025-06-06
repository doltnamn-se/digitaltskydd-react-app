
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { URLStatusStep } from "@/types/url-management";
import { getStatusText } from "./utils/statusUtils";

interface URLStatusSelectProps {
  currentStatus: string;
  urlId: string;
  customerId: string;
  onStatusChange: (newStatus: string) => void;
}

export const URLStatusSelect = ({ currentStatus, urlId, customerId, onStatusChange }: URLStatusSelectProps) => {
  const { t } = useLanguage();

  const handleStatusChange = async (newStatus: URLStatusStep) => {
    try {
      console.log('URLStatusSelect - handleStatusChange called with:', { 
        urlId, 
        newStatus, 
        currentStatus,
        customerId 
      });
      
      // Skip if status hasn't changed
      if (newStatus === currentStatus) {
        console.log('URLStatusSelect - Status unchanged, skipping update');
        return;
      }

      // Call onStatusChange which will handle notification creation with the removal type
      console.log('URLStatusSelect - Calling onStatusChange');
      await onStatusChange(newStatus);
      
    } catch (error) {
      console.error('URLStatusSelect - Error in handleStatusChange:', error);
    }
  };

  return (
    <Select value={currentStatus} onValueChange={handleStatusChange}>
      <SelectTrigger className="w-[140px] h-8 text-xs bg-background">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="received">{t('deindexing.status.received')}</SelectItem>
        <SelectItem value="case_started">{t('deindexing.status.case.started')}</SelectItem>
        <SelectItem value="request_submitted">{t('deindexing.status.request.submitted')}</SelectItem>
        <SelectItem value="removal_approved">{t('deindexing.status.removal.approved')}</SelectItem>
      </SelectContent>
    </Select>
  );
};
