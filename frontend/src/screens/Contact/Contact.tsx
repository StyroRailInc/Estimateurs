import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { TextField, Box, Button } from "@mui/material";
import "./../../global.css";
import "./Contact.css";

export default function Contact() {
  const { t } = useTranslation();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [additionalInfo, setAdditionalInfo] = useState<string>("");
  const [document, setDocument] = useState<File | null>(null);
  const [error, setError] = useState<string>("");

  const MAX_FILE_SIZE_MB = 250;
  const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const allowedFormats = [
        "application/pdf",
        "application/zip",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "image/jpeg",
        "image/png",
        "image/vnd.dwg",
        "image/vnd.dxf",
        "application/x-tgif",
        "application/octet-stream",
        "model/x3d+xml",
      ];

      if (!allowedFormats.includes(file.type)) {
        setError(t("Format non supporté. Veuillez télécharger un fichier valide."));
        setDocument(null);
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError(
          t(`Le fichier est trop volumineux. La taille maximale est de ${MAX_FILE_SIZE_MB}MB.`)
        );
        setDocument(null);
        return;
      }

      setError("");
      setDocument(file);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <main className="flex-center page-container">
      <Box
        className="flex-vertical contact-container"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "dark"
              ? "var(--background-color-very-dark)"
              : "var(--transparent)",
        }}
      >
        <div className="flex-center full-width">
          <h1>{t("Contactez-nous")}</h1>
        </div>
        <div className="flex-horizontal form-info-container">
          <div className="form-container">
            <form name="Contact" onSubmit={handleSubmit} acceptCharset="UTF-8">
              <label htmlFor="name">{t("Nom")}</label>
              <TextField
                id="name"
                fullWidth
                size="small"
                className="input-spacing"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <label htmlFor="email">{t("Courriel")}</label>
              <TextField
                id="email"
                fullWidth
                size="small"
                className="input-spacing"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
              />

              <label htmlFor="phone">{t("Téléphone")}</label>
              <TextField
                id="phone"
                fullWidth
                size="small"
                className="input-spacing"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
              />

              <label htmlFor="additional-info"></label>
              <TextField
                id="additional-info"
                fullWidth
                multiline
                rows={4}
                className="input-spacing"
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
              />

              <label htmlFor="document">{t("Télécharger un plan")}</label>
              <input
                id="document"
                type="file"
                accept=".pdf,.dwg,.dxf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.skp,.rvt,.rfa,.rte,.pln,.tpl,.gsm,.ifc,.zip"
                onChange={handleFileUpload}
                className="input-spacing"
              />

              {error && <p className="error">{error}</p>}
              {document && (
                <p>
                  {t("Fichier sélectionné")}: {document.name}
                </p>
              )}
              <div className="flex-end">
                <Button type="submit" variant="contained" color="secondary">
                  {t("Envoyer")}
                </Button>
              </div>
            </form>
          </div>
          <div id="info-container">
            <div className="info-section">
              <h2>{t("Adresse")}</h2>
              <p>65 Quebec Rte 105, Wakefield, Quebec J0X 1T0</p>
            </div>

            <div className="info-section">
              <h2>{t("Téléphone")}</h2>
              <p>{t("Heures: 7:30am - 4:30pm, Lundi - Vendredi")}</p>
              <p>{"(819) 643-4456"}</p>
            </div>
          </div>
        </div>
      </Box>
    </main>
  );
}
