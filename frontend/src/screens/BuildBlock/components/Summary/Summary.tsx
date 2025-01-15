import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { Constants } from "src/constants";
import { Button } from "@mui/material";
import { useAuth } from "src/context/AuthContext";
import { TextField } from "@mui/material";
import { HTTP_STATUS } from "src/utils/http";
import "./../../../../global.css";
import { useNavigate } from "react-router-dom";
import SingleInputDialog from "src/components/SingleInputDialog";

const Summary: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [data, setData] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submissionName, setSubmissionName] = useState(
    sessionStorage.getItem("buildblock-estimation-name")
  );
  const [error, setError] = useState("");
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
    if (!estimation) {
      return;
    }
    fetch(`${Constants.API}/compute/buildblock`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(JSON.parse(estimation).walls),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((e) => {
        setData(e);
        console.log(e);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const submitData = (replace: boolean) => {
    fetch(`${Constants.API}/compute/buildblock/submissions?replace=${replace}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
          setError(t("Une soumission avec ce nom existe déjà. Voulez-vous l'écraser?"));
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
    setError("");
  };

  const handleCancel = () => {
    if (!error) {
      setIsModalOpen(false);
    } else {
      setError("");
    }
  };

  const blockTypes = [
    { key: "straight", label: t("Blocs droits") },
    { key: "ninetyCorner", label: t("Coins 90") },
    { key: "fortyFiveCorner", label: t("Coins 45") },
    { key: "brickLedge", label: t("Support à Maçon") },
    { key: "doubleTaperTop", label: t("Double Biseaux") },
    { key: "buck", label: t("Bucks") },
    { key: "thermalsert", label: t("Insertion Isométriques") },
  ];

  return (
    <>
      <h2>{t("Blocks")}</h2>
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
                // Filter widths with non-zero quantities for this block type
                const filteredWidths = Object.keys(data["blockQuantities"]).filter(
                  (width) =>
                    data["blockQuantities"][width][type.key] &&
                    data["blockQuantities"][width][type.key]["quantity"]
                );

                // Skip rendering this type if no widths have non-zero quantities
                if (filteredWidths.length === 0) return null;

                return filteredWidths.map((width, index) => {
                  const isFirstRow = index === 0;
                  return (
                    <TableRow key={`${type.key}-${width}`}>
                      {isFirstRow && (
                        <TableCell rowSpan={filteredWidths.length}>{type.label}</TableCell>
                      )}
                      <TableCell>{width}</TableCell>
                      <TableCell>
                        {data["blockQuantities"][width][type.key]["quantity"] || 0}
                      </TableCell>
                      <TableCell>{data["blockQuantities"][width][type.key]["nBundles"]}</TableCell>
                    </TableRow>
                  );
                });
              })}
            </TableBody>
          ) : (
            <TableBody>
              <TableRow>
                <TableCell>{t("Veuillez remplir le formulaire Build Block")}</TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </TableContainer>

      <h2>{t("Barres d'armature d'acier")}</h2>
      <TableContainer component={Paper} style={{ marginTop: "20px", marginBottom: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t("Béton")}</TableCell>
              <TableCell>{t("ReBar #1")}</TableCell>
              <TableCell>{t("ReBar #2")}</TableCell>
              <TableCell>{t("ReBar #3")}</TableCell>
              <TableCell>{t("ReBar #4")}</TableCell>
              <TableCell>{t("ReBar #5")}</TableCell>
            </TableRow>
          </TableHead>
          {data ? (
            <TableBody>
              <TableRow>
                <TableCell>{data["concreteVolume"] + " m3"}</TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              <TableRow>
                <TableCell>{t("Veuillez remplir le formulaire Build Block")}</TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </TableContainer>
      <div className="flex-end">
        <Button variant={"contained"} color="secondary" onClick={handleSave}>
          {t("Enregistrer")}
        </Button>
      </div>

      <SingleInputDialog
        title="Nom de la soumission"
        open={isModalOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      >
        {!error ? (
          <TextField
            id="name"
            fullWidth
            value={submissionName}
            onChange={handleInputChange}
            size="small"
            required
          />
        ) : (
          <p className="error">{t(error)}</p>
        )}
      </SingleInputDialog>
    </>
  );
};

export default Summary;
