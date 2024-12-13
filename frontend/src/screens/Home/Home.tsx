import React from "react";
import { useTranslation } from "react-i18next";

const Home: React.FC = () => {
  const { t } = useTranslation();
  return <p>{t("Dimensions du mur")}</p>;
};

export default Home;
