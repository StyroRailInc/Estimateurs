import "react-i18next";

// define the type for translations
declare module "react-i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: {
      translation: string;
    };
  }
}
