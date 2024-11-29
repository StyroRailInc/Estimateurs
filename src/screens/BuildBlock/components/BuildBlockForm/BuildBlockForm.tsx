import React from "react";
import Drawer from "../Drawer";
import { Button } from "@mui/material";
import CustomTextField from "src/components/CustomTextField";
import "./BuildBlockForm.css";
import "./../../BuildBlock.css";

interface BuildBlockFormProps {}

const BuildBlockForm: React.FC<BuildBlockFormProps> = () => {
  return (
    <div className="main-page-container">
      <form>
        <Drawer title={"Dimensions du Mur"} isOpen={true}>
          <label htmlFor="width">Largeur</label>
          <CustomTextField id="width" fullWidth size="small" className="input-spacing" required />
          <label htmlFor="height">Hauteur</label>
          <CustomTextField id="height" fullWidth size="small" className="input-spacing" required />
          <label htmlFor="length">Longueur</label>
          <CustomTextField id="length" fullWidth size="small" className="input-spacing" required />
        </Drawer>
        <Drawer title={"Nombre de Coins"} isOpen={true}>
          <div className="flex-horizontal">
            <div className="flex-vertical">
              <label htmlFor="inside-90">Internes 90</label>
              <CustomTextField id="inside-90" fullWidth size="small" className="input-spacing" />
              <label htmlFor="outside-90">Externes 90</label>
              <CustomTextField id="outside-90" fullWidth size="small" className="input-spacing" />
            </div>
            <div className="flex-vertical margin-left">
              <label htmlFor="inside-45">Internes 45</label>
              <CustomTextField id="inside-45" fullWidth size="small" className="input-spacing" />
              <label htmlFor="outside-45">Externes 45</label>
              <CustomTextField id="outside-45" fullWidth size="small" className="input-spacing" />
            </div>
          </div>
        </Drawer>
        <Drawer title={"Ouvertures"} isOpen={true}>
          <div className="flex-horizontal">
            <div className="flex-vertical">
              <label htmlFor="opening-width">Largeur</label>
              <CustomTextField
                id="opening-width"
                fullWidth
                size="small"
                className="input-spacing"
              />
            </div>
            <div className="flex-vertical margin-left">
              <label htmlFor="opening-height">Hauteur</label>
              <CustomTextField
                id="opening-height"
                fullWidth
                size="small"
                className="input-spacing"
              />
            </div>
            <div className="flex-vertical margin-left">
              <label htmlFor="opening-length">Longueur</label>
              <CustomTextField
                id="opening-length"
                fullWidth
                size="small"
                className="input-spacing"
              />
            </div>
          </div>
          <div className="space-between">
            <Button variant="contained" color="success">
              Ajouter
            </Button>
            <Button variant="contained" color="error">
              Supprimer
            </Button>
          </div>
        </Drawer>
        <Drawer title={"Support à Maçon"} isOpen={false}>
          <label htmlFor="brick-ledge-width">Largeur</label>
          <CustomTextField
            id="brick-ledge-width"
            fullWidth
            size="small"
            className="input-spacing"
          />
          <label htmlFor="brick-ledge-length">Longueur</label>
          <CustomTextField
            id="brick-ledge-length"
            fullWidth
            size="small"
            className="input-spacing"
          />
          <label htmlFor="brick-ledge-90">Coins 90</label>
          <CustomTextField id="brick-ledge-90" fullWidth size="small" className="input-spacing" />
          <label htmlFor="brick-ledge-45">Coins 45</label>
          <CustomTextField id="brick-ledge-45" fullWidth size="small" className="input-spacing" />
        </Drawer>
        <Drawer title={"Doubles Biseaux"} isOpen={false}>
          <label htmlFor="double-taper-width">Largeur</label>
          <CustomTextField
            id="double-taper-width"
            fullWidth
            size="small"
            className="input-spacing"
          />
          <label htmlFor="double-taper-length">Longueur</label>
          <CustomTextField
            id="double-taper-length"
            fullWidth
            size="small"
            className="input-spacing"
          />
          <label htmlFor="double-taper-90">Coins 90</label>
          <CustomTextField id="double-taper-90" fullWidth size="small" className="input-spacing" />
          <label htmlFor="double-taper-45">Coins 45</label>
          <CustomTextField id="double-taper-45" fullWidth size="small" className="input-spacing" />
        </Drawer>
        <Drawer title="Armatures" isOpen={false}>
          <p>To be determined</p>
        </Drawer>
        <div className="flex-end" style={{ marginBottom: 100, marginTop: 20 }}>
          <Button type="submit" variant="contained" color="secondary">
            Calculer
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BuildBlockForm;
