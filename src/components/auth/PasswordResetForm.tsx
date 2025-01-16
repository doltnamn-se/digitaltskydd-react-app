import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface PasswordResetFormProps {
  onCancel: () => void;
}

export const PasswordResetForm = ({ onCancel }: PasswordResetFormProps) => {
  const { t } = useLanguage();
  const [resetEmail, setResetEmail] = useState("");

  const handleResetPassword = async () => {
    if (!resetEmail) {
      toast.error(t('error.missing.email'));
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      console.error("Password reset error:", error);
      toast.error(error.message);
    } else {
      toast.success(t('reset.password.success'));
      onCancel();
      setResetEmail("");
    }
  };

  return (
    <div className="flex justify-center w-full">
      <div className="bg-white dark:bg-[#232325] p-8 border border-gray-200 dark:border-[#303032] w-full max-w-sm fade-in rounded-[7px] font-system-ui">
        <h2 className="text-xl font-semibold mb-6 text-center dark:text-white font-system-ui">
          {t('forgot.password')}
        </h2>
        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-bold text-gray-700 dark:text-gray-300 font-system-ui">
              {t('email')}
            </label>
            <Input
              id="email"
              type="email"
              placeholder={t('email.placeholder')}
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="w-full h-12 bg-background dark:bg-[#3f3f46] dark:text-white dark:border-[#303032] dark:placeholder:text-gray-400 rounded-[4px] font-system-ui"
            />
          </div>
          <div className="flex flex-col gap-3">
            <Button
              onClick={handleResetPassword}
              className="w-full h-12 bg-black hover:bg-gray-900 text-white dark:bg-white dark:text-black dark:hover:bg-[#cfcfcf] rounded-[4px] font-system-ui"
            >
              {t('send.recovery.link')}
            </Button>
            <Button
              onClick={onCancel}
              variant="outline"
              className="w-full h-12 rounded-[4px] font-system-ui"
            >
              {t('cancel')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};