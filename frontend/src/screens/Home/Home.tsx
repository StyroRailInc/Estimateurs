import { Button } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import "./../../global.css";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { Routes } from "../../interfaces/routes";

const Home: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleContinueClick = () => {
    navigate(Routes.BUILDBLOCK);
  };

  return (
    <main className="home-page">
      <div>
        <section className="flex-start">
          <h1 className="hero-title">{t("Bienvenue")}</h1>
        </section>
        <div className="text-image-container">
          <div className="text-container">
            <p className="info-text">
              {t(
                `Ceci est notre outil d’estimation en ligne ! Nous sommes ravis de vous accompagner dans vos projets et de vous offrir des solutions pratiques pour simplifier vos calculs. Bien que tous les efforts raisonnables aient été déployés pour assurer l'exactitude de cet outil, des facteurs hors de notre contrôle tels que les conditions variées du site, le style d'installation, la méthode utilisée et les pertes de matériaux peuvent influencer l’estimation totale. Styrorail inc. met cet outil à votre disposition à titre de service, strictement à des fins d’estimation. Nous espérons que cet outil vous sera utile et vous aidera à mieux planifier vos projets. En utilisant ce site web, vous comprenez et acceptez que la responsabilité de Styrorail est limitée à la correction des erreurs et omissions contenues dans cet outil.`
              )}
            </p>
          </div>
          <div className="image-wrapper">
            <img className="image-styrowork" src="/Estimateurs/styrowork.jpg" alt="Styro Work" />
            <img className="image-styro-upscaled overlap-image" src="/Estimateurs/BuildBlock.jpg" alt="Styrorail logo" />
          </div>
        </div>

        <Button variant="contained" color="primary" className="button-no-caps" onClick={handleContinueClick}>
          {t("Continuer")}
        </Button>
      </div>
    </main>
  );
};

export default Home;
