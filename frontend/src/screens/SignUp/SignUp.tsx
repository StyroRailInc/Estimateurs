import React, { useState } from "react";
import { Button, TextField, Box } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./../../global.css";
import { Constants } from "src/constants";
import { HTTP_STATUS } from "./../../utils/http";
import { useAuth } from "src/context/AuthContext";

interface SignUpProps {}

const SignUp: React.FC<SignUpProps> = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isAccountCreated, setIsAccountCreated] = useState(false);
  const { login } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setError("");

    fetch(`${Constants.API}/auth/sign-up`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then(async (response) => {
        if (!response.ok) {
          if (response.status === HTTP_STATUS.CONFLICT) {
            throw new Error(t("Courriel déjà sélectionné. Changez le courriel."));
          } else {
            throw new Error(t("Échec de l'inscription. Réessayez."));
          }
        }

        const token = response.headers.get("x-auth-token");
        const parsedResponse = await response.json();
        if (token && parsedResponse) {
          login({ name: parsedResponse.name, email: formData.email, token });
        }
        setIsAccountCreated(true);
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
          {!isAccountCreated ? (
            <div className="flex-vertical">
              <h1>{t("S'inscrire")}</h1>

              <form name="SignUp" onSubmit={handleSubmit} acceptCharset="UTF-8">
                {error && <p className="error">{t(error)}</p>}
                <label htmlFor="name">{t("Nom")}</label>
                <TextField
                  id="name"
                  fullWidth
                  size="small"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                />
                <label htmlFor="email">{t("Courriel")}</label>
                <TextField
                  type="email"
                  id="email"
                  fullWidth
                  size="small"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                />
                <label htmlFor="password">{t("Mot de passe")}</label>
                <TextField
                  type="password"
                  id="password"
                  fullWidth
                  size="small"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <label htmlFor="confirm-password">{t("Confirmez le mot de passe")}</label>
                <TextField
                  type="password"
                  id="confirmPassword"
                  fullWidth
                  size="small"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
                <Button
                  type="submit"
                  fullWidth
                  color="secondary"
                  variant="contained"
                  className="login-button button-no-caps"
                >
                  {t("S'inscrire")}
                </Button>
              </form>
              <div className="flex-horizontal">
                <p>{t("Vous possédez déjà un compte?")}</p>
                <Button
                  variant="text"
                  className="button-no-caps"
                  sx={{ color: "var(--secondary-color-light)" }}
                  component={RouterLink}
                  to="/login"
                >
                  {t("Se connecter")}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex-center flex-vertical">
              <h1>{t("Bienvenue") + " " + formData.name + "!"}</h1>
              <Button
                color="secondary"
                variant="contained"
                className="button-no-caps"
                // sx={{ color: "var(--secondary-color-light)" }}
                component={RouterLink}
                to="/account"
              >
                {t("Continuer")}
              </Button>
            </div>
          )}
        </Box>
      </div>
    </main>
  );
};

export default SignUp;
