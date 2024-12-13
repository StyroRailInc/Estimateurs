import React, { useState } from "react";
import Drawer from "../Drawer";
import { Button } from "@mui/material";
import CustomTextField from "src/components/FormTextField";
import "./../../BuildBlock.css";
import { useTranslation } from "react-i18next";
import "./../../../../global.css";
import { WallState } from "../../types/BBTypes";
import { initialWallState } from "../../reducer";

interface SummaryProps {}

function getResults() {
  const results = sessionStorage.getItem("buildblock-results");
  if (results) {
    return JSON.parse(results);
  }
}

const Summary: React.FC<SummaryProps> = () => {
  const { t } = useTranslation();
  const [data, setData] = useState(getResults());

  return (
    <div className="main-page-container">
      <div className="flex-center-vertical">
        <div className="flex-horizontal" style={{ justifyContent: "flex-start" }}>
          <div className="flex-vertical" style={{ width: 200 }}>
            <p>{t("Blocs droits")}</p>
            {data &&
              Object.keys(data).map((width) => {
                return <p>{width}</p>;
              })}
          </div>
          <div className="flex-vertical" style={{ width: 200 }}>
            <p>{t("Quantité")}</p>
            {data &&
              Object.keys(data).map((width) => {
                return <p>{data[width]["straight"]}</p>;
              })}
          </div>
          <div>
            <p>{t("Paquets")}</p>
          </div>
        </div>

        <div className="flex-horizontal" style={{ justifyContent: "flex-start" }}>
          <div className="flex-vertical" style={{ width: 200 }}>
            <p>{t("Coins 90")}</p>
            {data &&
              Object.keys(data).map((width) => {
                return <p>{width}</p>;
              })}
          </div>
          <div className="flex-vertical" style={{ width: 200 }}>
            <p>{t("Quantité")}</p>
            {data &&
              Object.keys(data).map((width) => {
                return <p>{data[width]["ninetyCorner"]}</p>;
              })}
          </div>
          <div className="flex-vertical" style={{ width: 200 }}>
            <p>{t("Paquets")}</p>
          </div>
        </div>
        <div className="flex-horizontal full-width" style={{ justifyContent: "flex-start" }}>
          <div className="flex-vertical" style={{ width: 200 }}>
            <p>{t("Coins 45")}</p>
            {data &&
              Object.keys(data).map((width) => {
                return <p>{width}</p>;
              })}
          </div>
          <div className="flex-vertical" style={{ width: 200 }}>
            <p>{t("Quantité")}</p>
            {data &&
              Object.keys(data).map((width) => {
                return <p>{data[width]["fortyFiveCorner"]}</p>;
              })}
          </div>
          <div className="flex-vertical" style={{ width: 200 }}>
            <p>{t("Paquets")}</p>
          </div>
        </div>
        <div className="flex-horizontal" style={{ justifyContent: "flex-start" }}>
          <div className="flex-vertical" style={{ width: 200 }}>
            <p>{t("Support à Maçon")}</p>
            {data &&
              Object.keys(data).map((width) => {
                return <p>{width}</p>;
              })}
          </div>
          <div className="flex-vertical" style={{ width: 200 }}>
            <p>{t("Quantité")}</p>
            {data &&
              Object.keys(data).map((width) => {
                return <p>{data[width]["brickLedge"]}</p>;
              })}
          </div>
          <div className="flex-vertical" style={{ width: 200 }}>
            <p>{t("Paquets")}</p>
          </div>
        </div>
        <div className="flex-horizontal" style={{ justifyContent: "flex-start" }}>
          <div className="flex-vertical" style={{ width: 200 }}>
            <p>{t("Double Biseaux")}</p>
            {data &&
              Object.keys(data).map((width) => {
                return <p>{width}</p>;
              })}
          </div>
          <div className="flex-vertical" style={{ width: 200 }}>
            <p>{t("Quantité")}</p>
            {data &&
              Object.keys(data).map((width) => {
                return <p>{data[width]["doubleTaperTop"]}</p>;
              })}
          </div>
          <div className="flex-vertical" style={{ width: 200 }}>
            <p>{t("Paquets")}</p>
          </div>
        </div>
        <div className="flex-horizontal" style={{ justifyContent: "flex-start" }}>
          <div className="flex-vertical" style={{ width: 200 }}>
            <p>{t("Bucks")}</p>
            {data &&
              Object.keys(data).map((width) => {
                return <p>{width}</p>;
              })}
          </div>
          <div className="flex-vertical" style={{ width: 200 }}>
            <p>{t("Quantité")}</p>
            {data &&
              Object.keys(data).map((width) => {
                return <p>{data[width]["buck"]}</p>;
              })}
          </div>
          <div className="flex-vertical" style={{ width: 200 }}>
            <p>{t("Paquets")}</p>
          </div>
        </div>
        <p>{t("Métriques")}</p>
        <p>{t("Pieds carrés brut")}</p>
        <p>{t("Pieds carrés net")}</p>
        <p>{t("Pieds carrés d'ouverture")}</p>
        <p>{t("Quantité de Béton")}</p>
        <p>{t("Rebars")}</p>
      </div>
    </div>
  );
};

export default Summary;
