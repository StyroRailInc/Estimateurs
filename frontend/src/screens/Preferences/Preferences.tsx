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
import "./Preferences.css";
import { Endpoints } from "src/interfaces/endpoints";

const Preferences: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { mode, setColorMode } = useColorMode();
  const { language, setLanguage } = useLanguage();
  const theme = useTheme();

  const updatePreferences = async (newMode: string, newLanguage: string) => {
    const preferences = { language: newLanguage, mode: newMode };
    try {
      await apiService.post(Endpoints.PREFERENCES, { email: user?.email, preferences }, user);
    } catch (error) {
      console.error("There has been an error updating preferences");
    }
  };

  return (
    <main>
      <div className="preferences-container">
        <h1 className="preferences-title">{t("Préférences")}</h1>
        <Box
          className="preferences-box"
          sx={{
            backgroundColor: (theme) => (theme.palette.mode === "light" ? "var(--transparent)" : "var(--background-color-very-dark)"),
          }}
        >
          <div className="preference-row">
            <p className="preference-label">{t("Thème")}</p>
            <IconButton
              onClick={() => {
                setColorMode("light");
                updatePreferences("light", language);
              }}
              className="preference-button"
              sx={{ color: theme.palette.text.primary + " !important" }}
            >
              <LightMode />
              <span>{t("Clair")}</span>
            </IconButton>
            <IconButton
              onClick={() => {
                setColorMode("dark");
                updatePreferences("dark", language);
              }}
              className="preference-button"
              sx={{ color: theme.palette.text.primary + " !important" }}
            >
              <DarkMode />
              <span>{t("Sombre")}</span>
            </IconButton>
          </div>

          <div className="preference-row">
            <p className="preference-label">{t("Langue")}</p>
            <IconButton
              onClick={() => {
                setLanguage("fr");
                updatePreferences(mode, "fr");
              }}
              className="preference-button"
              sx={{ color: theme.palette.text.primary + " !important" }}
            >
              <span role="img" aria-label="French">
                🇨🇦
              </span>
              <span>Français</span>
            </IconButton>
            <IconButton
              onClick={() => {
                setLanguage("eng");
                updatePreferences(mode, "eng");
              }}
              className="preference-button"
              sx={{ color: theme.palette.text.primary + " !important" }}
            >
              <span role="img" aria-label="English">
                🇬🇧
              </span>
              <span>English</span>
            </IconButton>
          </div>
        </Box>
      </div>
    </main>
  );
};

export default Preferences;
