import { createContext, ReactNode, useContext, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";

type Language = "eng" | "fr";

const LanguageContext = createContext<{
  language: Language;
  toggleLanguage: () => void;
}>({
  language: "fr",
  toggleLanguage: () => {},
});

interface LanguageProviderProps {
  children: ReactNode;
}

const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState<Language>(i18n.language === "eng" ? "eng" : "fr");

  const toggleLanguage = () => {
    const newLanguage = language === "fr" ? "eng" : "fr";
    i18n.changeLanguage(newLanguage);
    setLanguage(newLanguage);
  };

  const value = { language, toggleLanguage };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => useContext(LanguageContext);

export default LanguageProvider;
