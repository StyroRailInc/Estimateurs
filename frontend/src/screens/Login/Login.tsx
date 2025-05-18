import React, { useState } from "react";
import "./../../global.css";
import "./Login.css";
import { useTranslation } from "react-i18next";
import { Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { Routes } from "src/interfaces/routes";
import { HTTP_STATUS } from "src/utils/http";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "src/context/AuthContext";
import { Box } from "@mui/material";
import { useColorMode } from "src/context/ColorModeContext";
import { useLanguage } from "src/context/LanguageContext";
import CustomTextField from "src/components/CustomTextField";
import { apiService } from "src/services/api";
import { Endpoints } from "src/interfaces/endpoints";
import { HttpError } from "src/utils/http-error";

interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();
  const { setLanguage } = useLanguage();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const { setColorMode } = useColorMode();
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { body, headers } = await apiService.post(Endpoints.LOGIN, { email: email, password: password });
      const token = headers.get("x-auth-token");
      const preferences = JSON.parse(body.preferences);

      if (token) {
        login({ name: body.name, email, token });
      }

      if (preferences.language) setLanguage(preferences.language);
      if (preferences.mode) setColorMode(preferences.mode);

      const redirectPath = location.state?.from?.pathname || Routes.ACCOUNT;
      navigate(redirectPath);
    } catch (error) {
      const status = (error as HttpError)?.status;

      if (status === HTTP_STATUS.NOT_FOUND) {
        setError("Le courriel est invalide");
      } else if (status === HTTP_STATUS.UNAUTHORIZED) {
        setError("Mot de passe incorrecte. Réessayez.");
      } else {
        setError("Échec de l'inscription. Réessayez.");
      }
    }
  };

  return (
    <main>
      <div className="flex-center page-container">
        <Box
          className="login-container"
          sx={{
            backgroundColor: (theme) => (theme.palette.mode === "dark" ? "var(--background-color-very-dark)" : "var(--transparent)"),
          }}
        >
          <div className="flex-vertical">
            <h1>{t("Se connecter")}</h1>
            <form name="Login" onSubmit={handleSubmit} acceptCharset="UTF-8">
              {error && <p className="error">{t(error)}</p>}
              <label htmlFor="email">{t("Courriel")}</label>
              <CustomTextField type="email" id="email" fullWidth size="small" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <label htmlFor="password">{t("Mot de passe")}</label>
              <CustomTextField
                type="password"
                id="password"
                fullWidth
                size="small"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button type="submit" fullWidth color="secondary" variant="contained" className="login-button button-no-caps">
                {t("Se connecter")}
              </Button>
            </form>
            <div className="flex-horizontal">
              <p>{t("Vous n'avez pas de compte?")}</p>
              <Button variant="text" className="button-no-caps sign-up-button" component={RouterLink} to={Routes.SIGN_UP}>
                {t("S'inscrire")}
              </Button>
            </div>
          </div>
        </Box>
      </div>
    </main>
  );
};

export default Login;
