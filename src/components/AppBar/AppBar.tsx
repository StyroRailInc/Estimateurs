import React, { useState, useContext } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { Outlet } from "react-router-dom";
import "./AppBar.css";
import LinkButton from "../LinkButton";
import "./../../global.css";
import { Button, IconButton, Palette } from "@mui/material";
import { useTranslation } from "react-i18next";
import LightMode from "@mui/icons-material/LightMode";
import DarkMode from "@mui/icons-material/DarkMode";
import ColorModeContext from "src/context/ColorModeContext";

export default function ButtonAppBar() {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState<string>(i18n.language);
  const { mode, setMode } = useContext(ColorModeContext);
  const updateLanguage = () => {
    setLanguage((prev) => {
      return prev === "fr" ? "eng" : "fr";
    });
    i18n.changeLanguage(language === "fr" ? "eng" : "fr");
  };

  return (
    <>
      <AppBar position="sticky" elevation={0} className="app-bar">
        <Toolbar className="toolbar">
          <div className="left-container flex-start">
            <img src="/styro.png" alt="Company-logo" className="image"></img>
            <p className="styrorail">STYRORAIL</p>
          </div>
          <div className="center-container flex-center">
            <LinkButton to={"/"}>{t("Accueil")}</LinkButton>
            <LinkButton to={"/buildblock"}>Build Block</LinkButton>
            <LinkButton to={"/srf"}>SR-F</LinkButton>
            <LinkButton to={"/contact"}>Contact</LinkButton>
          </div>
          <div className="right-container flex-end">
            <IconButton
              color="secondary"
              onClick={() => {
                setMode(mode === "light" ? "dark" : "light");
              }}
            >
              {mode === "light" && <LightMode />}
              {mode === "dark" && <DarkMode />}
            </IconButton>
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
