import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { Outlet, NavLink } from "react-router-dom";
import "./AppBar.css";
import "./../../global.css";
import { Button, IconButton, useMediaQuery } from "@mui/material";
import { useTranslation } from "react-i18next";
import LightMode from "@mui/icons-material/LightMode";
import DarkMode from "@mui/icons-material/DarkMode";
import { useColorMode } from "src/context/ColorModeContext";
import ProfileIcon from "../ProfileIcon";
import AppBarDrawer from "./AppBarDrawer";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useLanguage } from "src/context/LanguageContext";
import { useState } from "react";

export default function ButtonAppBar() {
  const { t } = useTranslation();
  const { mode, toggleColorMode } = useColorMode();
  const { language, toggleLanguage } = useLanguage();

  const isLargeScreen = useMediaQuery("(min-width:992px)");
  const screens = ["Accueil", "Build Block", "SR-F", "Contact"];
  const paths = ["/", "/buildblock", "/srf", "/contact"];

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        className="app-bar"
        sx={{
          backgroundColor: (theme) => theme.palette.primary.main,
        }}
      >
        <Toolbar className="toolbar">
          <div className="flex-start left-container">
            <img src="/styro.png" alt="Company-logo" className="image"></img>
            <p className="styrorail">STYRORAIL</p>
          </div>
          {isLargeScreen ? (
            <>
              <div className="center-container flex-center">
                {screens.map((screen, index) => (
                  <Button
                    to={paths[index]}
                    fullWidth
                    color="secondary"
                    component={NavLink}
                    className="button-no-caps app-bar-button"
                  >
                    {t(screen)}
                  </Button>
                ))}
              </div>
              <div className="right-container flex-end">
                <IconButton onClick={toggleColorMode} className="app-bar-button">
                  {mode === "dark" && <LightMode />}
                  {mode === "light" && <DarkMode />}
                </IconButton>
                <Button color="secondary" onClick={toggleLanguage} className="app-bar-button">
                  {language}
                </Button>
                <ProfileIcon
                  ButtonComponent={
                    <IconButton className="app-bar-button">
                      <AccountCircleIcon />
                    </IconButton>
                  }
                />
              </div>
            </>
          ) : (
            <AppBarDrawer />
          )}
        </Toolbar>
      </AppBar>
      <Outlet />
    </>
  );
}
