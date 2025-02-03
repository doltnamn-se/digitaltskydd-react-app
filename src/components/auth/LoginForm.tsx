import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LoginFormProps {
  onForgotPassword: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const LoginForm = ({ onForgotPassword, isLoading, setIsLoading }: LoginFormProps) => {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Attempting sign in with email:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Sign in error:", error);
        if (error.message === 'Invalid login credentials') {
          toast.error(t('error.invalid.credentials'));
        } else {
          toast.error(t('error.signin'));
        }
        return;
      }

      if (data?.session) {
        console.log("Sign in successful, session established");
        await supabase.auth.setSession(data.session);
        window.location.href = '/';
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error(t('error.generic'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-12 bg-transparent border-0 border-b border-[#e0e0e0] dark:border-[#3a3a3b] rounded-none text-black dark:text-white placeholder:text-[#000000A6] dark:placeholder:text-[#FFFFFFA6] font-system-ui"
          placeholder={t('email.placeholder')}
          disabled={isLoading}
          required
        />
      </div>
      <div>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full h-12 bg-transparent border-0 border-b border-[#e0e0e0] dark:border-[#3a3a3b] rounded-none text-black dark:text-white placeholder:text-[#000000A6] dark:placeholder:text-[#FFFFFFA6] font-system-ui"
          placeholder={t('password.placeholder')}
          disabled={isLoading}
          required
        />
      </div>
      <Button
        type="submit"
        className="w-full h-12 bg-black hover:bg-[#333333] text-white dark:bg-white dark:text-black dark:hover:bg-[#cfcfcf] rounded-[4px] font-system-ui"
        disabled={isLoading}
      >
        {isLoading ? t('loading') : t('sign.in')}
      </Button>
      <Button
        type="button"
        variant="ghost"
        onClick={onForgotPassword}
        className="w-full text-xs text-gray-600 hover:text-[#000000] hover:bg-transparent dark:text-gray-400 dark:hover:text-white font-normal"
      >
        {t('forgot.password')}
      </Button>
    </form>
  );
};