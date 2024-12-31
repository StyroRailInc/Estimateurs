import React from "react";
import FormTextField from "src/components/FormTextField";
import "./../../global.css";
import "./Login.css";
import { useTranslation } from "react-i18next";
import { Button } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Link as RouterLink } from "react-router-dom";

interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
  const { t } = useTranslation();
  return (
    <main>
      <div className="flex-center page-container">
        <div className="login-container">
          <div className="flex-vertical">
            <h1>{t("Se connecter")}</h1>
            <form>
              <label htmlFor="email">{t("Courriel")}</label>
              <FormTextField type="email" id="email" fullWidth size="small"></FormTextField>
              <label htmlFor="password">{t("Mot de passe")}</label>
              <FormTextField type="password" id="password" fullWidth size="small"></FormTextField>
              <Button
                type="submit"
                fullWidth
                color="secondary"
                variant="contained"
                className="login-button"
              >
                {t("Login")}
              </Button>
            </form>
            <div className="flex-horizontal">
              <p>{t("Vous n'avez pas de compte?")}</p>
              <Button
                variant="text"
                className="button-no-caps"
                sx={{ color: "var(--secondary-color-light)" }}
                component={RouterLink}
                to="/sign-up"
              >
                {t("S'inscrire")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
