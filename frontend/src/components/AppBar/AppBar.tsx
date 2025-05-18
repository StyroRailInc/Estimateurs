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
import { Routes } from "../../interfaces/routes";
import { Screens } from "../../interfaces/screens";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ButtonAppBar() {
  const { t } = useTranslation();
  const location = useLocation();
  const { mode, toggleColorMode } = useColorMode();
  const { language, toggleLanguage } = useLanguage();
  const [selectedScreen, setSelectedScreen] = useState<Screens>(Screens.HOME);

  const isLargeScreen = useMediaQuery("(min-width:992px)");
  const screens = [Screens.HOME, Screens.BUILDBLOCK, Screens.CONTACT];
  const paths = [Routes.HOME, Routes.BUILDBLOCK, Routes.CONTACT];

  useEffect(() => {
    const pathToScreenMap: Record<string, Screens> = {
      [Routes.HOME]: Screens.HOME,
      [Routes.BUILDBLOCK]: Screens.BUILDBLOCK,
      [Routes.CONTACT]: Screens.CONTACT,
      [Routes.ACCOUNT]: Screens.ACCOUNT,
      [Routes.LOGIN]: Screens.ACCOUNT,
      [Routes.SIGN_UP]: Screens.ACCOUNT,
    };

    const matchedScreen = pathToScreenMap[location.pathname];
    if (matchedScreen) {
      setSelectedScreen(matchedScreen);
    }
  }, [location.pathname]);

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
            <img src="/Estimateurs/styro.png" alt="Company-logo" className="image"></img>
            <p className="styrorail">STYRORAIL</p>
          </div>
          {isLargeScreen ? (
            <>
              <div className="center-container flex-center">
                {screens.map((screen, index) =>
                  selectedScreen === screen ? (
                    <Button
                      key={screen}
                      to={paths[index]}
                      fullWidth
                      color="secondary"
                      component={NavLink}
                      className="button-no-caps app-bar-button-selected"
                    >
                      {t(screen)}
                    </Button>
                  ) : (
                    <Button key={screen} to={paths[index]} fullWidth color="secondary" component={NavLink} className="button-no-caps app-bar-button">
                      {t(screen)}
                    </Button>
                  )
                )}
              </div>
              <div className="right-container flex-end">
                <IconButton onClick={toggleColorMode} className="app-bar-button">
                  {mode === "dark" && <LightMode />}
                  {mode === "light" && <DarkMode />}
                </IconButton>
                <Button color="secondary" onClick={toggleLanguage} className="app-bar-button">
                  {language === "fr" ? "eng" : "fr"}
                </Button>
                <ProfileIcon
                  ButtonComponent={
                    selectedScreen === Screens.ACCOUNT ? (
                      <IconButton className="app-bar-button-selected">
                        <AccountCircleIcon />
                      </IconButton>
                    ) : (
                      <IconButton className="app-bar-button">
                        <AccountCircleIcon />
                      </IconButton>
                    )
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
