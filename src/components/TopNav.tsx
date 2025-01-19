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

export const TopNav = () => {
  const { isCollapsed, toggleCollapse, isMobileMenuOpen, toggleMobileMenu } = useSidebar();
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key.toLowerCase() === 's') {
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
      "fixed top-0 right-0 h-16 z-50 transition-[left] duration-200",
      isMobile ? "left-0 px-4 bg-white dark:bg-[#1c1c1e] border-b border-[#e5e7eb] dark:border-[#232325]" : 
      isCollapsed ? "left-16 px-12" : "left-72 px-12"
    )}>
      <div className="flex items-center justify-between h-full">
        {/* Mobile Menu Button */}
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

        {/* Left side - Search bar (hidden on mobile) */}
        <div className={cn(
          "flex-1 max-w-md",
          isMobile ? "hidden" : "block"
        )}>
          <SearchBar />
        </div>
        
        {/* Right side - Actions */}
        <div className="flex items-center gap-2 ml-auto">
          <ThemeToggle />
          <NotificationButtons />
          <UserProfileMenu />
        </div>
      </div>
    </div>
  );
};