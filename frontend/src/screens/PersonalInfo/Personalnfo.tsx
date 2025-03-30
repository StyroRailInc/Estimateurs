import React from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "src/context/AuthContext";
import { Box } from "@mui/material";

const PersonalInfo: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <main>
      <div style={{ padding: "20px" }}>
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
          {t("Informations Personnelles")}
        </h1>
        <Box
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? "var(--transparent)"
                : "var(--background-color-very-dark)",
            borderRadius: "8px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <p style={{ padding: "20px 0px 0px 20px" }}>{t("Nom") + " : " + `${user?.name}`}</p>
          <p style={{ padding: "0px 0px 20px 20px" }}>{t("Courriel") + " : " + `${user?.email}`}</p>
        </Box>
      </div>
    </main>
  );
};

export default PersonalInfo;
