import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { getUserInitials, getFullName } from "@/utils/profileUtils";
import { ProfileMenuItems } from "./ProfileMenuItems";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

export const UserProfileMenu = () => {
  const { userEmail, userProfile, isSigningOut, setIsSigningOut } = useUserProfile();
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  const handleSignOut = async () => {
    if (isSigningOut) {
      console.log("Sign out already in progress");
      return;
    }

    try {
      setIsSigningOut(true);
      console.log("Attempting to sign out...");
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Error getting session:", sessionError);
        toast.error(t('error.signout'));
        return;
      }

      if (!session) {
        console.log("No active session found, redirecting to auth page");
        window.location.href = '/auth';
        return;
      }
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Error signing out:", error);
        toast.error(t('error.signout'));
        return;
      }
      
      console.log("Sign out successful");
      window.location.href = '/auth';
      
    } catch (err) {
      console.error("Unexpected error during sign out:", err);
      toast.error(t('error.signout'));
    } finally {
      setIsSigningOut(false);
    }
  };

  const initials = getUserInitials(userProfile);
  const displayName = getFullName(userProfile, userEmail);

  console.log("UserProfileMenu - Current profile:", { userProfile, initials, displayName });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex items-center gap-2 text-[#000000] dark:text-gray-300 hover:bg-black/5 dark:hover:bg-[#232325] ml-2"
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-black/5 dark:bg-[#303032] text-[#5e5e5e] dark:text-gray-400 text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
          {!isMobile && (
            <>
              <span className="text-sm font-medium">{displayName}</span>
              <ChevronDown className="w-4 h-4 text-[#5e5e5e] dark:text-gray-400" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 p-2">
        <ProfileMenuItems onSignOut={handleSignOut} isSigningOut={isSigningOut} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};