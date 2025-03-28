import { createContext, ReactNode, useContext, useState, useMemo, SetStateAction } from "react";
import { useTranslation } from "react-i18next";

const LanguageContext = createContext<{
  language: "eng" | "fr";
  toggleLanguage: () => void;
  setLanguage: (language: "fr" | "eng") => void;
}>({
  language: "fr",
  toggleLanguage: () => {},
  setLanguage: () => {},
});

interface LanguageProviderProps {
  children: ReactNode;
}

const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const { i18n } = useTranslation();
  const [language, setLanguageI1] = useState<"eng" | "fr">(i18n.language === "eng" ? "eng" : "fr");

  const toggleLanguage = () => {
    const newLanguage = language === "fr" ? "eng" : "fr";
    i18n.changeLanguage(newLanguage);
    setLanguageI1(newLanguage);
  };

  const setLanguage = (newLanguage: "fr" | "eng") => {
    i18n.changeLanguage(newLanguage);
    setLanguageI1(newLanguage);
  };

  const value = { language, toggleLanguage, setLanguage };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => useContext(LanguageContext);

export default LanguageProvider;
