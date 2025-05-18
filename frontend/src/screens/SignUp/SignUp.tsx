import React, { useState } from "react";
import { Button, Box } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./../../global.css";
import { Routes } from "src/interfaces/routes";
import { HTTP_STATUS } from "./../../utils/http";
import { useAuth } from "src/context/AuthContext";
import CustomTextField from "src/components/CustomTextField";
import { Endpoints } from "src/interfaces/endpoints";
import { apiService } from "src/services/api";
import { HttpError } from "src/utils/http-error";
import "./SignUp.css";

interface SignUpProps {}

const SignUp: React.FC<SignUpProps> = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [isAccountCreated, setIsAccountCreated] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setError("");

    try {
      const { body, headers } = await apiService.post(Endpoints.SIGN_UP, formData);
      const token = headers.get("x-auth-token");

      if (token && body) login({ name: body.name, email: formData.email, token });
      setIsAccountCreated(true);
    } catch (error) {
      const status = (error as HttpError)?.status;

      if (status === HTTP_STATUS.CONFLICT) {
        setError(t("Courriel déjà sélectionné. Changez le courriel."));
      } else {
        setError(t("Échec de l'inscription. Réessayez."));
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
          {!isAccountCreated ? (
            <div className="flex-vertical">
              <h1>{t("S'inscrire")}</h1>

              <form name="SignUp" onSubmit={handleSubmit} acceptCharset="UTF-8">
                {error && <p className="error">{t(error)}</p>}
                <label htmlFor="name">{t("Nom")}</label>
                <CustomTextField id="name" fullWidth size="small" required value={formData.name} onChange={handleInputChange} />
                <label htmlFor="email">{t("Courriel")}</label>
                <CustomTextField type="email" id="email" fullWidth size="small" required value={formData.email} onChange={handleInputChange} />
                <label htmlFor="password">{t("Mot de passe")}</label>
                <CustomTextField
                  type="password"
                  id="password"
                  fullWidth
                  size="small"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <label htmlFor="confirm-password">{t("Confirmez le mot de passe")}</label>
                <CustomTextField
                  type="password"
                  id="confirmPassword"
                  fullWidth
                  size="small"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
                <Button type="submit" fullWidth color="secondary" variant="contained" className="login-button button-no-caps">
                  {t("S'inscrire")}
                </Button>
              </form>
              <div className="flex-horizontal">
                <p>{t("Vous possédez déjà un compte?")}</p>
                <Button variant="text" className="button-no-caps login-button-color" component={RouterLink} to={Routes.LOGIN}>
                  {t("Se connecter")}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex-center flex-vertical">
              <h1>{t("Bienvenue") + " " + formData.name + "!"}</h1>
              <Button color="secondary" variant="contained" className="button-no-caps" component={RouterLink} to={Routes.ACCOUNT}>
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
