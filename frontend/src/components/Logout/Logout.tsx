import { useState } from "react";
import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useAuth } from "src/context/AuthContext";
import { Constants } from "src/constants";
import { HTTP_STATUS } from "src/utils/http";
import "./../../global.css";
import { useNavigate } from "react-router-dom";

const Logout: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState();

  const handleLogoutClick = () => {
    fetch(`${Constants.API}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then(async (response) => {
        if (!response.ok) {
          if (response.status === HTTP_STATUS.UNAUTHORIZED) {
            throw new Error(t("Jeton de session invalide"));
          } else {
            throw new Error(t("Échec de la déconnexion. Réessayez."));
          }
        }
        logout();
        navigate("/login");
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <>
      {error && <p className="error">{t(error)}</p>}
      <Button onClick={handleLogoutClick}>{t("Se déconnecter")}</Button>
    </>
  );
};

export default Logout;
