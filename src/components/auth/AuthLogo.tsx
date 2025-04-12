import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
interface AuthLogoProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  centered?: boolean;
}
export const AuthLogo: React.FC<AuthLogoProps> = ({
  className,
  centered = false,
  ...props
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();
  useEffect(() => {
    // Initial check for dark mode
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);

    // Create observer to watch for class changes on html element
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.attributeName === 'class') {
          const isDark = document.documentElement.classList.contains('dark');
          setIsDarkMode(isDark);
        }
      });
    });

    // Start observing
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    // Cleanup
    return () => observer.disconnect();
  }, []);
  const isAdminRoute = location.pathname.startsWith('/admin');
  return <div className={`relative h-12 w-48 ${centered ? 'mx-auto' : ''}`} {...props}>
      {isAdminRoute ? <img src="/lovable-uploads/digitaltskydd-admin-logo.svg" alt="Admin Logo" className="h-9 w-auto object-fill" /> : <>
          <img src="/lovable-uploads/digitaltskydd.se-app-logo-dark.svg" alt="Logo" className={`h-12 w-auto absolute inset-0 transition-opacity duration-200 ${isDarkMode ? 'opacity-0' : 'opacity-100'}`} />
          <img src="/lovable-uploads/digitaltskydd.se-app-logo-white.svg" alt="Logo" className={`h-12 w-auto absolute inset-0 transition-opacity duration-200 ${isDarkMode ? 'opacity-100' : 'opacity-0'}`} />
        </>}
    </div>;
};