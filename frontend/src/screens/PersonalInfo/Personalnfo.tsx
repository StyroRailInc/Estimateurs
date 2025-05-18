import React from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "src/context/AuthContext";
import { Box } from "@mui/material";
import "./PersonalInfo.css";

const PersonalInfo: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <main>
      <div className="personal-info-container">
        <h1 className="personal-info-title">{t("Informations Personnelles")}</h1>
        <Box
          className="personal-info-box"
          sx={{
            backgroundColor: (theme) => (theme.palette.mode === "light" ? "var(--transparent)" : "var(--background-color-very-dark)"),
          }}
        >
          <p className="personal-info-name">{`${t("Nom")} : ${user?.name}`}</p>
          <p className="personal-info-email">{`${t("Courriel")} : ${user?.email}`}</p>
        </Box>
      </div>
    </main>
  );
};

export default PersonalInfo;
