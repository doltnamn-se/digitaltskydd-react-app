
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/contexts/SidebarContext";
import { SearchBar } from "./nav/SearchBar";
import { ThemeToggle } from "./nav/ThemeToggle";
import { NotificationButtons } from "./nav/NotificationButtons";
import { UserProfileMenu } from "./nav/UserProfileMenu";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { useLanguage } from "@/contexts/LanguageContext";

export const TopNav = () => {
  const { isCollapsed, toggleCollapse, isMobileMenuOpen, toggleMobileMenu } = useSidebar();
  const isMobile = useIsMobile();
  const { t } = useLanguage();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('global-search') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className={cn(
      "sticky top-0 right-0 h-16 z-[40] transition-[left] duration-200",
      isMobile ? (
        "left-0 px-4 border-b border-[#e5e7eb] dark:border-[#232325] bg-white dark:bg-[#1c1c1e]"
      ) : (
        cn(
          "bg-[#f4f4f4] dark:bg-[#161618]",
          isCollapsed ? "left-16" : "left-72"
        )
      )
    )}>
      <div className={cn(
        "h-full max-w-[1400px] mx-auto",
        isMobile ? "px-4" : "px-12"
      )}>
        <div className="flex items-center justify-between h-full">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="mr-2"
            >
              <Menu className="h-6 w-6" />
            </Button>
          )}

          <div className={cn(
            "flex-1 max-w-md",
            isMobile ? "hidden" : "block"
          )}>
            <SearchBar />
          </div>
          
          <div className="flex items-center gap-2 ml-auto">
            <TooltipProvider delayDuration={300}>
              <ThemeToggle />
              <NotificationButtons />
            </TooltipProvider>
            <UserProfileMenu />
          </div>
        </div>
      </div>
    </div>
  );
};

