import React from "react";
import Drawer from "../Drawer";
import { Button } from "@mui/material";
import CustomTextField from "src/components/CustomTextField";
import "./../../BuildBlock.css";

interface BuildDeckFormProps {}

const BuildDeckForm: React.FC<BuildDeckFormProps> = () => {
  return (
    <div className="main-page-container">
      <form>
        <Drawer title={"Dimensions de la terrasse"} isOpen={true}>
          <label htmlFor="width">Largeur</label>
          <CustomTextField id="height" fullWidth size="small" className="input-spacing" required />
          <label htmlFor="length">Longueur</label>
          <CustomTextField id="length" fullWidth size="small" className="input-spacing" required />
        </Drawer>
        <Drawer title={"Spécifications"} isOpen={true}>
          <label htmlFor="panel-type">Type de Panneaux</label>
          <CustomTextField
            id="panel-type"
            fullWidth
            size="small"
            className="input-spacing"
            required
          />
          <label htmlFor="cap-depth">Profondeur du Cap</label>
          <CustomTextField
            id="cap-depth"
            fullWidth
            size="small"
            className="input-spacing"
            required
          />
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

export default BuildDeckForm;
