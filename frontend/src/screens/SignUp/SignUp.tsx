import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./../../global.css";
import { Constants } from "src/constants";

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setError(t("Les mots de passe ne correspondent pas."));
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
      .then((response) => {
        if (!response.ok) {
          throw new Error(t("Échec de l'inscription. Réessayez."));
        }
        return response.json();
      })
      .then((data) => {
        console.log(t("Inscription réussie!"), data);
      })
      .catch((error) => {
        console.error(error);
        setError(error.message);
      });
  };

  return (
    <main>
      <div className="flex-center page-container">
        <div className="login-container">
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
                className="login-button"
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
        </div>
      </div>
    </main>
  );
};

export default SignUp;
