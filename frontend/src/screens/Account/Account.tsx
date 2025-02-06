import React, { useState } from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import MenuIcon from "@mui/icons-material/Menu";
import { IconButton, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import CustomListItem from "src/components/CustomListItem";
import { HTTP_STATUS } from "./../../utils/http";
import { Constants } from "src/constants";
import { useAuth } from "src/context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./../../global.css";
import { Outlet } from "react-router-dom";

const Account: React.FC = () => {
  const drawerWidth = 250;
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const handleLogoutClick = () => {
    fetch(`${Constants.API}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
      body: JSON.stringify(user),
    })
      .then(async (response) => {
        if (!response.ok) {
          if (response.status === HTTP_STATUS.UNAUTHORIZED) {
            throw new Error(t("Jeton de session invalide"));
          } else {
            throw new Error(t("Échec de la déconnexion. Réessayez."));
          }
        }
        logout();
        navigate("/login");
        sessionStorage.clear();
        localStorage.clear();
      })
      .catch((error) => setError(error.message));
  };

  return (
    <div>
      {isSmallScreen && (
        <IconButton onClick={toggleDrawer(true)}>
          <MenuIcon />
        </IconButton>
      )}

      <Drawer
        variant={isSmallScreen ? "temporary" : "permanent"}
        open={open || !isSmallScreen}
        onClose={toggleDrawer(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            marginTop: "var(--app-bar-height)",
            height: isSmallScreen ? "100%" : "calc(100% - var(--app-bar-height))",
          },
        }}
      >
        <div role="presentation">
          <List onClick={toggleDrawer(false)}>
            <CustomListItem title="Informations personnelles" to="/account" />
            <CustomListItem title="Préférences" to="/account/preferences" />
          </List>
          <Divider />
          <List onClick={toggleDrawer(false)}>
            <CustomListItem title="Build Block" to="/account/build-block" />
            <CustomListItem title="SR-F" to="/account/srf" />
          </List>
        </div>
        <div>
          <Divider />
          <CustomListItem
            title="Se déconnecter"
            style={{ color: "red" }}
            onClick={handleLogoutClick}
          />
        </div>
      </Drawer>

      <div
        style={{
          flexGrow: 1,
          marginLeft: isSmallScreen ? 0 : `${drawerWidth}px`, // Offset main content for permanent drawer
        }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default Account;
