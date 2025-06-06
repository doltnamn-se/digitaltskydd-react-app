
import { TopNav } from "@/components/TopNav";
import { AuthLogo } from "@/components/auth/AuthLogo";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useSidebar } from "@/contexts/SidebarContext";
import { AdminNavigation } from "@/components/nav/AdminNavigation";
import { MainNavigation } from "@/components/nav/MainNavigation";
import { SidebarFooter } from "@/components/nav/SidebarFooter";
import { useLanguage } from "@/contexts/LanguageContext";
import { AdminBottomNav } from "@/components/nav/AdminBottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { UserBottomNav } from "@/components/nav/UserBottomNav";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const { isMobileMenuOpen, toggleMobileMenu } = useSidebar();
  const { userProfile } = useUserProfile();
  const { t } = useLanguage();
  const isAdmin = userProfile?.role === 'super_admin';
  const isMobile = useIsMobile();

  const Navigation = () => {
    return (
      <nav>
        {isAdmin && <AdminNavigation toggleMobileMenu={toggleMobileMenu} />}
        <MainNavigation toggleMobileMenu={toggleMobileMenu} />
      </nav>
    );
  };

  return (
    <div className="relative">
      {/* Sidebar - Desktop */}
      <div className="hidden md:block bg-white dark:bg-[#1c1c1e] border-r border-[#e5e7eb] dark:border-[#232325] w-72 h-screen fixed left-0 z-[1000]">
        <div className="px-8 py-6">
          <AuthLogo className="w-full h-auto" />
        </div>

        <div className="h-px bg-[#e5e7eb] dark:bg-[#2d2d2d] mx-6 mb-8 transition-colors duration-200" />

        <div className="px-6">
          <Navigation />
        </div>

        <SidebarFooter />
      </div>

      {/* Sidebar - Mobile */}
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-[1000] transition-opacity duration-200 md:hidden ${
        isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`} onClick={toggleMobileMenu}>
        <div 
          className={`fixed inset-y-0 left-0 w-72 bg-white dark:bg-[#1c1c1e] transform transition-transform duration-200 ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={e => e.stopPropagation()}
        >
          <div className="px-8 py-6">
            <AuthLogo className="relative h-8" />
          </div>

          <div className="h-px bg-[#e5e7eb] dark:bg-[#2d2d2d] mx-6 mb-8 transition-colors duration-200" />

          <div className="px-6">
            <Navigation />
          </div>

          <SidebarFooter />
        </div>
      </div>

      {/* Main Content with conditional navigation for desktop vs mobile */}
      <div className="md:ml-72 min-h-screen bg-[#f4f4f4] dark:bg-[#161618] transition-colors duration-200">
        {/* Only show TopNav on desktop, on mobile it comes from MobilePersistentLayout */}
        {!isMobile && <TopNav />}
        
        <main className={`${isMobile ? '' : 'px-4 md:px-12 pt-12 pb-20 md:pb-12'} relative`}>
          {children}
        </main>
      </div>

      {/* Only show BottomNav on desktop view. On mobile, it comes from MobilePersistentLayout */}
      {!isMobile && isMobile && (isAdmin ? <AdminBottomNav /> : <UserBottomNav />)}
    </div>
  );
};
