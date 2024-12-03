import React from "react";
import Drawer from "../Drawer";
import { Button } from "@mui/material";
import FormTextField from "src/components/FormTextField";
import "./BuildBlockForm.css";
import "./../../BuildBlock.css";
import "./../../../../global.css";
import { useTranslation } from "react-i18next";

interface BuildBlockFormProps {}

const BuildBlockForm: React.FC<BuildBlockFormProps> = () => {
  const { t } = useTranslation();

  return (
    <div className="main-page-container">
      <form>
        <Drawer title={t("Dimensions du Mur")} isOpen={true}>
          <label htmlFor="width">{t("Largeur")}</label>
          <FormTextField id="width" fullWidth size="small" className="input-spacing" required />
          <label htmlFor="height">{t("Hauteur")}</label>
          <FormTextField id="height" fullWidth size="small" className="input-spacing" required />
          <label htmlFor="length">{t("Longueur")}</label>
          <FormTextField id="length" fullWidth size="small" className="input-spacing" required />
        </Drawer>
        <Drawer title={t("Nombre de Coins")} isOpen={true}>
          <div className="flex-horizontal">
            <div className="flex-vertical full-width">
              <label htmlFor="inside-90">{t("Interne 90")}</label>
              <FormTextField id="inside-90" fullWidth size="small" className="input-spacing" />
              <label htmlFor="outside-90">{t("Externe 90")}</label>
              <FormTextField id="outside-90" fullWidth size="small" className="input-spacing" />
            </div>
            <div className="flex-vertical full-width margin-left">
              <label htmlFor="inside-45">{t("Interne 45")}</label>
              <FormTextField id="inside-45" fullWidth size="small" className="input-spacing" />
              <label htmlFor="outside-45">{t("Externe 45")}</label>
              <FormTextField id="outside-45" fullWidth size="small" className="input-spacing" />
            </div>
          </div>
        </Drawer>
        <Drawer title={t("Ouverture")} isOpen={true}>
          <div className="flex-horizontal">
            <div className="flex-vertical full-width">
              <label htmlFor="opening-width">{t("Largeur")}</label>
              <FormTextField id="opening-width" fullWidth size="small" className="input-spacing" />
            </div>
            <div className="flex-vertical full-width margin-left">
              <label htmlFor="opening-height">{t("Hauteur")}</label>
              <FormTextField id="opening-height" fullWidth size="small" className="input-spacing" />
            </div>
            <div className="flex-vertical full-width margin-left">
              <label htmlFor="opening-length">{t("Longueur")}</label>
              <FormTextField id="opening-length" fullWidth size="small" className="input-spacing" />
            </div>
          </div>
          <div className="space-between">
            <Button variant="contained" color="success">
              {t("Ajouter")}
            </Button>
            <Button variant="contained" color="error">
              {t("Supprimer")}
            </Button>
          </div>
        </Drawer>
        <Drawer title={t("Support à Maçon")} isOpen={false}>
          <label htmlFor="brick-ledge-width">{t("Largeur")}</label>
          <FormTextField id="brick-ledge-width" fullWidth size="small" className="input-spacing" />
          <label htmlFor="brick-ledge-length">{t("Longueur")}</label>
          <FormTextField id="brick-ledge-length" fullWidth size="small" className="input-spacing" />
          <label htmlFor="brick-ledge-90">{t("Coins") + " 90"}</label>
          <FormTextField id="brick-ledge-90" fullWidth size="small" className="input-spacing" />
          <label htmlFor="brick-ledge-45">{t("Coins") + "45"}</label>
          <FormTextField id="brick-ledge-45" fullWidth size="small" className="input-spacing" />
        </Drawer>
        <Drawer title={t("Double Biseaux")} isOpen={false}>
          <label htmlFor="double-taper-width">{t("Largeur")}</label>
          <FormTextField id="double-taper-width" fullWidth size="small" className="input-spacing" />
          <label htmlFor="double-taper-length">{t("Longueur")}</label>
          <FormTextField
            id="double-taper-length"
            fullWidth
            size="small"
            className="input-spacing"
          />
          <label htmlFor="double-taper-90">{t("Coins") + "90"}</label>
          <FormTextField id="double-taper-90" fullWidth size="small" className="input-spacing" />
          <label htmlFor="double-taper-45">{t("Coins") + "45"}</label>
          <FormTextField id="double-taper-45" fullWidth size="small" className="input-spacing" />
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

export default BuildBlockForm;
