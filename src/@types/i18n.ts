import "react-i18next";

// Define the type for your translations
declare module "react-i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: {
      translation: string;
    };
  }
}
