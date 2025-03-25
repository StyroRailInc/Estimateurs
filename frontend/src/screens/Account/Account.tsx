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
import { useAuth } from "src/context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./../../global.css";
import { Outlet } from "react-router-dom";
import { apiService } from "src/services/api";
import { HttpError } from "src/services/api";

const Account: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleLogoutClick = async () => {
    try {
      await apiService.post("/auth/logout", user, user);
      logout();
      navigate("/login");
    } catch (error) {
      if (error instanceof HttpError) {
        if (error.status === HTTP_STATUS.UNAUTHORIZED) {
          console.log(t("Jeton de session invalide"));
        } else {
          console.log(t("Échec de la déconnexion. Réessayez."));
        }
      }
    }
  };

  return (
    <div>
      {isSmallScreen && (
        <IconButton onClick={() => setOpen(true)}>
          <MenuIcon />
        </IconButton>
      )}

      <Drawer
        variant={isSmallScreen ? "temporary" : "permanent"}
        open={open || !isSmallScreen}
        onClose={() => setOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: "var(--drawer-width)",
            marginTop: "var(--app-bar-height)",
            height: isSmallScreen ? "100%" : "calc(100% - var(--app-bar-height))",
          },
        }}
      >
        <div role="presentation">
          <List onClick={() => setOpen(false)}>
            <CustomListItem title="Informations personnelles" to="/account" />
            <CustomListItem title="Préférences" to="/account/preferences" />
          </List>
          <Divider />
          <List onClick={() => setOpen(false)}>
            <CustomListItem title="Build Block" to="/account/build-block" />
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

      {/* Offset main content for permanent drawer */}
      <div
        style={{
          flexGrow: 1,
          marginLeft: isSmallScreen ? 0 : `var(--drawer-width)`,
        }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default Account;
