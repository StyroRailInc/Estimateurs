import { useTranslation } from "react-i18next";

interface SRFProps {}

const SRF: React.FC<SRFProps> = () => {
  const { t } = useTranslation();
  return <p>{t("Disponible Prochainement")}</p>;
};

export default SRF;
