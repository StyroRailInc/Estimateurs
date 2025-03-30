import { createContext, ReactNode, useContext, useState, useEffect } from "react";
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

  const getLanguage = () => {
    const savedLanguage = localStorage.getItem("language") as "eng" | "fr" | null;
    const browserLanguage = i18n.language;
    return savedLanguage || (browserLanguage === "eng" ? "eng" : "fr");
  };

  const [language, setLanguageState] = useState<"eng" | "fr">(getLanguage());

  useEffect(() => {
    const initialLanguage = getLanguage();
    setLanguageState(initialLanguage);
    i18n.changeLanguage(initialLanguage);
  }, []);

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const toggleLanguage = () => {
    const newLanguage = language === "fr" ? "eng" : "fr";
    i18n.changeLanguage(newLanguage);
    setLanguageState(newLanguage);
  };

  const setLanguage = (newLanguage: "fr" | "eng") => {
    i18n.changeLanguage(newLanguage);
    setLanguageState(newLanguage);
  };

  const value = { language, toggleLanguage, setLanguage };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => useContext(LanguageContext);

export default LanguageProvider;
