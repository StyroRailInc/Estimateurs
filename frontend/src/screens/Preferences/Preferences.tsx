import React from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "src/context/AuthContext";
import { Box } from "@mui/material";
import { useColorMode } from "src/context/ColorModeContext";
import { IconButton } from "@mui/material";
import { LightMode, DarkMode } from "@mui/icons-material";
import { useLanguage } from "src/context/LanguageContext";
import "./../../global.css";
import { apiService } from "src/services/api";
import { useTheme } from "@mui/material";

const Preferences: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { mode, setColorMode } = useColorMode();
  const { language, setLanguage } = useLanguage();
  const theme = useTheme();

  const updatePreferences = async (newMode: string, newLanguage: string) => {
    try {
      await apiService.post("/user/preferences", { email: user?.email, preferences: { language: newLanguage, mode: newMode } }, user);
    } catch (error) {
      console.error("There has been an error updating preferences");
    }
  };

  return (
    <main>
      <div style={{ padding: "20px" }}>
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>{t("Préférences")}</h1>
        <Box
          sx={{
            backgroundColor: (theme) => (theme.palette.mode === "light" ? "var(--transparent)" : "var(--background-color-very-dark)"),
            borderRadius: "8px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div className="flex-horizontal flex-start">
            <p style={{ padding: "20px 0px 0px 20px" }}>{t("Thème")}</p>
            <IconButton
              onClick={() => {
                setColorMode("light");
                updatePreferences("light", language);
              }}
              className="app-bar-button"
              sx={{ color: theme.palette.text.primary + " !important" }}
            >
              <LightMode />
              <span style={{ marginLeft: "5px" }}>{t("Clair")}</span>
            </IconButton>
            <IconButton
              onClick={() => {
                setColorMode("dark");
                updatePreferences("dark", language);
              }}
              className="app-bar-button"
              sx={{ color: theme.palette.text.primary + " !important" }}
            >
              <DarkMode />
              <span style={{ marginLeft: "5px" }}>{t("Sombre")}</span>
            </IconButton>
          </div>

          <div className="flex-horizontal flex-start">
            <p style={{ padding: "20px 0px 0px 20px" }}>{t("Langue")}</p>
            <IconButton
              onClick={() => {
                setLanguage("fr");
                updatePreferences(mode, "fr");
              }}
              className="app-bar-button"
              sx={{ color: theme.palette.text.primary + " !important" }}
            >
              <span role="img" aria-label="French">
                🇨🇦
              </span>
              <span style={{ marginLeft: "5px" }}>Français</span>
            </IconButton>
            <IconButton
              onClick={() => {
                setLanguage("eng");
                updatePreferences(mode, "eng");
              }}
              className="app-bar-button"
              sx={{ color: theme.palette.text.primary + " !important" }}
            >
              <span role="img" aria-label="English">
                🇬🇧
              </span>
              <span style={{ marginLeft: "5px" }}>English</span>
            </IconButton>
          </div>
        </Box>
      </div>
    </main>
  );
};

export default Preferences;
