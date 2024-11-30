import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import { Link, Outlet } from "react-router-dom";
import "./AppBar.css";

import LinkButton from "../LinkButton";
import "./../../global.css";
import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

export default function ButtonAppBar() {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState<string>(i18n.language);
  const updateLanguage = () => {
    setLanguage((prev) => {
      return prev === "fr" ? "eng" : "fr";
    });
    i18n.changeLanguage(language === "fr" ? "eng" : "fr");
  };
  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          height: "48px !important", // Force the height
        }}
      >
        <Toolbar
          sx={{
            height: "48px !important", // Force the height
            padding: "0 16px",
            minHeight: "48px !important", // Override minHeight
          }}
        >
          <div className="left-container">
            <img src="/styro.png" alt="Company-logo" className="image"></img>
            <p>STYRORAIL</p>
          </div>
          <div className="center-container">
            <LinkButton to={"/"}>{t("Accueil")}</LinkButton>
            <LinkButton to={"/buildblock"}>Build Block</LinkButton>
            <LinkButton to={"/srf"}>SR-F</LinkButton>
            <LinkButton to={"/contact"}>Contact</LinkButton>
          </div>
          <div className="right-container">
            <Button color="secondary" onClick={updateLanguage}>
              {language}
            </Button>
          </div>
        </Toolbar>
      </AppBar>
      <Outlet /> {/* Renders child routes */}
    </>
  );
}
