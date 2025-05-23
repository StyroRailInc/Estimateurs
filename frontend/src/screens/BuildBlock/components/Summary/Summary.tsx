import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Constants } from "src/constants";
import { Button } from "@mui/material";
import { useAuth } from "src/context/AuthContext";
import { TextField } from "@mui/material";
import { HTTP_STATUS } from "src/utils/http";
import "./../../../../global.css";
import { useNavigate } from "react-router-dom";
import SingleInputDialog from "src/components/SingleInputDialog";
import i18n from "src/i18n";

const Summary: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [data, setData] = useState<any>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submissionName, setSubmissionName] = useState(sessionStorage.getItem("buildblock-estimation-name"));
  const [error, setError] = useState("");
  const [saveError, setSaveError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubmissionName(e.target.value);
  };

  const handleSave = () => {
    if (user) {
      setIsModalOpen(true);
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    const estimation = sessionStorage.getItem("buildblock-estimation");
    if (!estimation) return;
    console.log(estimation);
    fetch(`${Constants.API}/compute/buildblock`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(JSON.parse(estimation).walls),
    })
      .then(async (response) => {
        if (response.ok) {
          return response.json();
        } else {
          const errorData = await response.json();
          setError(errorData.message);
        }
      })
      .then((e) => {
        setData(e);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const generateReport = () => {
    fetch(`${Constants.API}/compute/buildblock/submissions/pdf`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ language: i18n.language, data }),
    })
      .then((res) => res.json())
      .then((data) => {
        const byteCharacters = atob(data.pdf);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/pdf" });

        // Create a link element and trigger the download
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "report.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const submitData = (replace: boolean) => {
    fetch(`${Constants.API}/compute/buildblock/submissions?replace=${replace}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user ? user.token : "null"}`,
      },
      body: JSON.stringify({
        ...user,
        payload: {
          name: submissionName,
          submission: sessionStorage.getItem("buildblock-estimation"),
        },
      }),
    })
      .then((response) => {
        if (response.ok) {
          sessionStorage.removeItem("buildblock-estimation-name");
          setIsModalOpen(false);
        } else if (response.status === HTTP_STATUS.CONFLICT) {
          setSaveError("Une soumission avec ce nom existe déjà. Voulez-vous l'écraser?");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    !error ? submitData(false) : submitData(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSaveError("");
  };

  const handleCancel = () => {
    if (!saveError) {
      setIsModalOpen(false);
    } else {
      setSaveError("");
    }
  };

  const blockTypes = [
    { key: "straight", label: t("Bloc droit") },
    { key: "ninetyCorner", label: t("Coin à 90 degrés") },
    { key: "fortyFiveCorner", label: t("Coin à 45 degrés") },
    { key: "brickLedge", label: t("Support à maçon") },
    { key: "doubleTaperTop", label: t("Double biseau") },
    { key: "buck", label: t("Buck") },
    { key: "thermalsert", label: t("Insertion isolante") },
    { key: "kdStraight", label: t("Déconstruit droit") },
    { key: "kdNinetyCorner", label: t("Déconstruit coin à 90 degrés") },
    { key: "kdBrickLedge", label: t("Déconstruit support à maçon") },
    { key: "kdDoubleTaperTop", label: t("Déconstruit double biseau") },
  ];

  return (
    <>
      <h2 className="error">{error}</h2>
      <h2>{t("Blocs")}</h2>
      <TableContainer component={Paper} style={{ marginTop: "20px", marginBottom: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t("Type de bloc")}</TableCell>
              <TableCell>{t("Largeur")}</TableCell>
              <TableCell>{t("Quantité")}</TableCell>
              <TableCell>{t("Paquets")}</TableCell>
            </TableRow>
          </TableHead>
          {data ? (
            <TableBody>
              {blockTypes.map((type) => {
                const filteredWidths = Object.keys(data["blockQuantities"]).filter(
                  (width) => data["blockQuantities"][width][type.key] && data["blockQuantities"][width][type.key]["quantity"]
                );

                if (filteredWidths.length === 0) return null;

                return filteredWidths.map((width, index) => {
                  const isFirstRow = index === 0;
                  return (
                    <TableRow key={`${type.key}-${width}-${index}`}>
                      {isFirstRow && <TableCell rowSpan={filteredWidths.length}>{type.label}</TableCell>}
                      <TableCell>{width}</TableCell>
                      <TableCell>{data["blockQuantities"][width][type.key]["quantity"] || 0}</TableCell>
                      <TableCell>{data["blockQuantities"][width][type.key]["nBundles"]}</TableCell>
                    </TableRow>
                  );
                });
              })}
            </TableBody>
          ) : (
            <TableBody>
              <TableRow>
                <TableCell>
                  {t(
                    "Veuillez remplir le formulaire de Build Block. Assurez-vous que la hauteur, la largeur et la longueur de vos murs ne soient pas vides."
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </TableContainer>

      <h2>{t("Barres d'armature d'acier (20')")}</h2>
      <TableContainer component={Paper} style={{ marginTop: "20px", marginBottom: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t("Armature spécifiée")}</TableCell>
              <TableCell>{t("Quantité")}</TableCell>
            </TableRow>
          </TableHead>
          {data ? (
            <TableBody>
              {Object.keys(data["rebars"]).map(
                (width, index) =>
                  data["rebars"][width] !== 0 && (
                    <TableRow key={`row-${width}-${index}`}>
                      <TableCell>{width + '"'}</TableCell>
                      <TableCell>{data["rebars"][width]}</TableCell>
                    </TableRow>
                  )
              )}
            </TableBody>
          ) : (
            <TableBody>
              <TableRow>
                <TableCell>
                  {t(
                    "Veuillez remplir le formulaire de Build Block. Assurez-vous que la hauteur, la largeur et la longueur de vos murs ne soient pas vides."
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </TableContainer>

      <h2>{"Bridges"}</h2>
      <TableContainer component={Paper} style={{ marginTop: "20px", marginBottom: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t("Largeur")}</TableCell>
              <TableCell>{t("Quantité")}</TableCell>
              <TableCell>{t("Paquets")}</TableCell>
            </TableRow>
          </TableHead>
          {data ? (
            <TableBody>
              {Object.keys(data["bridges"]).map((width) => {
                const bridge = data["bridges"][width];
                if (bridge.quantity === 0) return null;

                return (
                  <TableRow key={width}>
                    <TableCell>{width}</TableCell>
                    <TableCell>{bridge.quantity}</TableCell>
                    <TableCell>{bridge.nBundles}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          ) : (
            <TableBody>
              <TableRow>
                <TableCell>
                  {t(
                    "Veuillez remplir le formulaire de Build Block. Assurez-vous que la hauteur, la largeur et la longueur de vos murs ne soient pas vides."
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </TableContainer>

      <h2>{t("Informations supplémentaires")}</h2>
      <TableContainer component={Paper} style={{ marginTop: "20px", marginBottom: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>{t("Quantité")}</TableCell>
              <TableCell>{t("Paquets")}</TableCell>
            </TableRow>
          </TableHead>
          {data ? (
            <TableBody>
              <TableRow>
                <TableCell>{t("Volume de béton") + " (Net)"}</TableCell>
                <TableCell>{data["concreteVolume"] + " m³"}</TableCell>
                <TableCell>{"-"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{t("Superficie (Brute)")}</TableCell>
                <TableCell>{data["squareFootage"].gross + " ft²"}</TableCell>
                <TableCell>{"-"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{t("Superficie (Net)")}</TableCell>
                <TableCell>{data["squareFootage"].net + " ft²"}</TableCell>
                <TableCell>{"-"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{t("Superficie des ouvertures")}</TableCell>
                <TableCell>{data["squareFootage"].opening + " ft²"}</TableCell>
                <TableCell>{"-"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{"Clips"}</TableCell>
                <TableCell>{data["clips"].quantity}</TableCell>
                <TableCell>{Math.ceil(data["clips"].nBundles)}</TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              <TableRow>
                <TableCell>
                  {t(
                    "Veuillez remplir le formulaire de Build Block. Assurez-vous que la hauteur, la largeur et la longueur de vos murs ne soient pas vides."
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </TableContainer>

      <div className="space-between" style={{ marginBottom: 30 }}>
        <Button variant={"outlined"} color="secondary" onClick={generateReport}>
          {t("Générer PDF")}
        </Button>
        <Button variant={"contained"} color="secondary" onClick={handleSave}>
          {t("Enregistrer")}
        </Button>
      </div>

      <SingleInputDialog title="Nom de la soumission" open={isModalOpen} onClose={handleClose} onSubmit={handleSubmit} onCancel={handleCancel}>
        {!saveError ? (
          <TextField id="name" fullWidth value={submissionName} onChange={handleInputChange} size="small" required />
        ) : (
          <p className="error">{t(saveError)}</p>
        )}
      </SingleInputDialog>
    </>
  );
};

export default Summary;
