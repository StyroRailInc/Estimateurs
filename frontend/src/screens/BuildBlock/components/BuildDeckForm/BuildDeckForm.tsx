import React from "react";
import Drawer from "../Drawer";
import { Button } from "@mui/material";
import FormTextField from "src/components/FormTextField";
import "./../../BuildBlock.css";
import { useTranslation } from "react-i18next";

interface BuildDeckFormProps {}

const BuildDeckForm: React.FC<BuildDeckFormProps> = () => {
  const { t } = useTranslation();
  return (
    <div className="main-page-container">
      <form>
        <Drawer title={t("Dimensions de la Terrasse")} isOpen={true}>
          <label htmlFor="width">{t("Largeur")}</label>
          <FormTextField id="height" fullWidth size="small" className="input-spacing" required />
          <label htmlFor="length">{t("Longueur")}</label>
          <FormTextField id="length" fullWidth size="small" className="input-spacing" required />
        </Drawer>
        <Drawer title={t("Spécifications")} isOpen={true}>
          <label htmlFor="panel-type">{t("Type de Panneaux")}</label>
          <FormTextField
            id="panel-type"
            fullWidth
            size="small"
            className="input-spacing"
            required
          />
          <label htmlFor="cap-depth">{t("Profondeur du Cap")}</label>
          <FormTextField id="cap-depth" fullWidth size="small" className="input-spacing" required />
        </Drawer>
        <Drawer title={t("Armatures")} isOpen={false}>
          <p>To be determined</p>
        </Drawer>
        <div className="flex-end" style={{ marginBottom: 100, marginTop: 20 }}>
          <Button type="submit" variant="contained" color="secondary">
            {t("Calculer")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BuildDeckForm;
