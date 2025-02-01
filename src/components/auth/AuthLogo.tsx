import { useEffect, useState } from "react";

interface AuthLogoProps extends React.HTMLAttributes<HTMLDivElement> {}

export const AuthLogo: React.FC<AuthLogoProps> = ({ className, ...props }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Initial check for dark mode
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);

    // Create observer to watch for class changes on html element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDark = document.documentElement.classList.contains('dark');
          setIsDarkMode(isDark);
        }
      });
    });

    // Start observing
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    // Cleanup
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative h-8 w-32 mx-auto" {...props}>
      <img 
        src="/lovable-uploads/doltnamn.se-app-logo-black.svg"
        alt="Logo" 
        className={`h-8 w-auto absolute inset-0 mx-auto transition-opacity duration-200 ${isDarkMode ? 'opacity-0' : 'opacity-100'}`}
      />
      <img 
        src="/lovable-uploads/doltnamn.se-app-logo-white.svg"
        alt="Logo" 
        className={`h-8 w-auto absolute inset-0 mx-auto transition-opacity duration-200 ${isDarkMode ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
};