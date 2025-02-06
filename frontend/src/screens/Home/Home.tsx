import { Button } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import "./../../global.css";
import "./Home.css";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleContinueClick = () => {
    navigate("buildblock");
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
                `Ceci est notre outils d’estimation en ligne ! Nous sommes ravis de vous accompagner dans vos projets et de vous offrir des solutions pratiques pour simplifier vos calculs. Bien que tous les efforts raisonnables aient été faits pour assurer l'exactitude de ces outils, des facteurs hors de notre contrôle tels que les conditions variées du site, le style d'installation, la méthode et les facteurs de déchets peuvent avoir une incidence sur l'estimation totale des matériaux. Styrorail inc. met ces outils à votre disposition en tant que service, strictement à des fins d'estimation. Nous espérons que ces outils vous seront utiles et vous aideront à mieux planifier vos projets. En utilisant ce site web, vous comprenez et acceptez que toute responsabilité pour Styrorail est limitée à la correction des erreurs et omissions contenues dans cet outil.`
              )}
            </p>
          </div>
          <div className="image-wrapper">
            <img className="image-styrowork" src="./../../../styrowork.jpg" alt="Styro Work" />
            <img
              className="image-styro-upscaled overlap-image"
              src="./../../../buildblock.jpg"
              alt="Styrorail logo"
            />
          </div>
        </div>

        <Button
          variant="contained"
          color="primary"
          className="button-no-caps"
          onClick={handleContinueClick}
        >
          {t("Continuer")}
        </Button>
      </div>
    </main>
  );
};

export default Home;
