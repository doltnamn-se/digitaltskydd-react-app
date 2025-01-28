import { useLanguage } from "@/contexts/LanguageContext";

export const NewLinks = () => {
  const { language } = useLanguage();
  
  return (
    <p className="text-[#000000] dark:text-white text-sm">
      {language === 'sv' 
        ? "När det dyker upp nya länkar om dig kommer du att få en notis och se länken här"
        : "When new links about you appear, you will receive a notification and see the link here"}
    </p>
  );
};