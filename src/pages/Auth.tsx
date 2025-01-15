import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthError, AuthApiError } from "@supabase/supabase-js";
import { Switch } from "@/components/ui/switch";
import { Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

const Auth = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Preload both logo images
    const lightLogo = new Image();
    const darkLogo = new Image();
    lightLogo.src = "/lovable-uploads/a60e3543-e8d5-4f66-a2eb-97eeedd073ae.png";
    darkLogo.src = "/lovable-uploads/868b20a1-c3f1-404c-b8da-9d33fe738d9d.png";

    const isDark = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', String(newDarkMode));
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session);
        if (event === "SIGNED_IN" && session) {
          navigate("/");
        }
        if (event === "SIGNED_OUT") {
          setErrorMessage("");
        }
        if (event === "PASSWORD_RECOVERY") {
          const { error } = await supabase.auth.getSession();
          if (error) {
            handleError(error);
          }
        }
      }
    );

    // Check if user is already signed in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleError = (error: AuthError) => {
    console.error("Auth error:", error);
    if (error instanceof AuthApiError) {
      switch (error.message) {
        case "Invalid login credentials":
          setErrorMessage("Felaktigt användarnamn eller lösenord");
          break;
        default:
          setErrorMessage("Ett fel uppstod. Försök igen senare.");
      }
    } else {
      setErrorMessage("Ett fel uppstod. Försök igen senare.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f6f4] dark:bg-[#161618] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-6">
          <div className="relative h-8">
            <img 
              src="/lovable-uploads/a60e3543-e8d5-4f66-a2eb-97eeedd073ae.png"
              alt="Logo" 
              className={`mx-auto h-8 absolute inset-0 transition-opacity duration-200 ${isDarkMode ? 'opacity-0' : 'opacity-100'}`}
            />
            <img 
              src="/lovable-uploads/868b20a1-c3f1-404c-b8da-9d33fe738d9d.png"
              alt="Logo" 
              className={`mx-auto h-8 absolute inset-0 transition-opacity duration-200 ${isDarkMode ? 'opacity-100' : 'opacity-0'}`}
            />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-black dark:text-white">Välkommen tillbaka</h1>
            <p className="text-gray-600 dark:text-gray-400">Logga in på ditt konto</p>
          </div>
        </div>
        
        {errorMessage && (
          <Alert variant="destructive">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <div className="bg-white dark:bg-[#232325] p-8 rounded-lg shadow-sm border border-gray-200 dark:border-[#303032]">
          <SupabaseAuth 
            supabaseClient={supabase}
            appearance={{ 
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#000000',
                    brandAccent: '#333333',
                    inputBackground: 'white',
                    inputBorder: '#E5E7EB',
                    inputBorderFocus: '#000000',
                    inputBorderHover: '#000000',
                  },
                  borderWidths: {
                    buttonBorderWidth: '1px',
                    inputBorderWidth: '1px',
                  },
                  radii: {
                    borderRadiusButton: '0.5rem',
                    buttonBorderRadius: '0.5rem',
                    inputBorderRadius: '0.5rem',
                  },
                },
              },
              style: {
                input: {
                  backgroundColor: isDarkMode ? '#3f3f46' : 'white',
                  color: isDarkMode ? '#fff' : '#6B7280',
                  borderColor: isDarkMode ? '#303032' : '#E5E7EB',
                }
              },
              className: {
                anchor: 'text-black hover:text-gray-700 dark:text-white dark:hover:text-gray-300',
                button: 'bg-black hover:bg-gray-900 text-white font-medium py-2 px-4 rounded-lg dark:bg-white dark:text-black dark:hover:bg-gray-100',
                container: 'space-y-4',
                divider: 'my-4',
                label: 'text-sm font-medium text-gray-700 dark:text-gray-300',
                loader: 'border-black dark:border-white',
                message: 'text-red-600 dark:text-red-400',
              },
            }}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'E-postadress',
                  password_label: 'Lösenord',
                  email_input_placeholder: 'Din e-postadress',
                  password_input_placeholder: 'Ditt lösenord',
                  button_label: 'Logga in',
                  loading_button_label: 'Loggar in...',
                  social_provider_text: 'Logga in med {{provider}}',
                  link_text: 'Har du redan ett konto? Logga in',
                }
              }
            }}
            providers={[]}
            view="sign_in"
            showLinks={false}
          />
          <div className="mt-6 text-center">
            <span className="text-gray-500 dark:text-gray-400">Har du inget konto?</span>
            {' '}
            <a 
              href="https://doltnamn.se/#planer" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-black hover:text-gray-700 dark:text-white dark:hover:text-gray-300 font-medium"
            >
              Registrera dig
            </a>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 px-4 py-3">
          <div className="flex items-center gap-3">
            <Moon className="w-4 h-4 text-[#4c4c49] dark:text-[#67676c] stroke-[1.5]" />
            <span className="text-sm text-[#1A1F2C] dark:text-slate-200">Mörkt läge</span>
          </div>
          <Switch
            checked={isDarkMode}
            onCheckedChange={toggleDarkMode}
            className="data-[state=checked]:bg-[#c3caf5] transition-colors duration-300"
          />
        </div>

        <div className="flex justify-center gap-6 mt-8">
          <Button variant="link" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
            Integritet
          </Button>
          <Button variant="link" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
            Licensvillkor
          </Button>
          <Button variant="link" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
            Användarvillkor
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;