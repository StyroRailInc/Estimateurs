import React, { useState } from "react";
import "./../../global.css";
import "./Login.css";
import { useTranslation } from "react-i18next";
import { Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { Constants } from "src/constants";
import { HTTP_STATUS } from "src/utils/http";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "src/context/AuthContext";
import { TextField } from "@mui/material";
import { Box } from "@mui/material";

interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetch(`${Constants.API}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    })
      .then(async (response) => {
        if (!response.ok) {
          if (response.status === HTTP_STATUS.NOT_FOUND) {
            throw new Error(t("Le courriel est invalide"));
          } else if (response.status === HTTP_STATUS.UNAUTHORIZED) {
            throw new Error(t("Mot de passe incorrecte. Réessayez."));
          } else {
            throw new Error(t("Échec de l'inscription. Réessayez."));
          }
        }
        const token = response.headers.get("x-auth-token");

        if (token) {
          login({ email, token });
        }
        return response.json();
      })
      .then(() => {
        const redirectPath = location.state?.from?.pathname || "/account";
        navigate(redirectPath);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <main>
      <div className="flex-center page-container">
        <Box
          className="login-container"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "dark"
                ? "var(--background-color-very-dark)"
                : "var(--transparent)",
          }}
        >
          <div className="flex-vertical">
            <h1>{t("Se connecter")}</h1>
            <form name="Login" onSubmit={handleSubmit} acceptCharset="UTF-8">
              {error && <p className="error">{t(error)}</p>}
              <label htmlFor="email">{t("Courriel")}</label>
              <TextField
                type="email"
                id="email"
                fullWidth
                size="small"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label htmlFor="password">{t("Mot de passe")}</label>
              <TextField
                type="password"
                id="password"
                fullWidth
                size="small"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                type="submit"
                fullWidth
                color="secondary"
                variant="contained"
                className="login-button button-no-caps"
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
        </Box>
      </div>
    </main>
  );
};

export default Login;
