import { MainLayout } from "@/components/layout/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect } from "react";

const AddressAlerts = () => {
  const { t, language } = useLanguage();

  useEffect(() => {
    document.title = language === 'sv' ? 
      "Adressbevakning | Doltnamn.se" : 
      "Address Alerts | Doltnamn.se";
  }, [language]);

  return (
    <MainLayout>
      <h1 className="text-2xl font-black tracking-[-.416px] text-[#000000] dark:text-white mb-6">
        {t('nav.address.alerts')}
      </h1>
      <div className="bg-white dark:bg-[#1c1c1e] p-6 rounded-[4px] shadow-sm border border-[#e5e7eb] dark:border-[#232325] transition-colors duration-200">
        {/* Content will be added later */}
      </div>
    </MainLayout>
  );
};

export default AddressAlerts;