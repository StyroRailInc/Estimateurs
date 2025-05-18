import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { TextField, Box, Button, useTheme } from "@mui/material";
import "./../../global.css";
import "./Contact.css";
import { apiService } from "src/services/api";
import { useLanguage } from "src/context/LanguageContext";
import { HttpError } from "src/utils/http-error";
import { HTTP_STATUS } from "src/utils/http";
import CustomTextField from "src/components/CustomTextField";

export default function Contact() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [additionalInfo, setAdditionalInfo] = useState<string>("");
  const [document, setDocument] = useState<File[]>([]);
  const [error, setError] = useState<string>("");
  const theme = useTheme();
  const [success, setSuccess] = useState(false);

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
        setDocument([]);
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError(t(`Le fichier est trop volumineux. La taille maximale est de ${MAX_FILE_SIZE_MB}MB.`));
        setDocument([]);
        return;
      }

      setError("");
      setDocument([...document, file]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = { name, email, phone, additionalInfo };
    try {
      await apiService.fileUpload("/contact", document, payload);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      if (error instanceof HttpError) {
        if (error.status === HTTP_STATUS.BAD_REQUEST) {
          console.log(t("Il manque des informations"));
        } else {
          console.log(t("Échec lors de l'envoie. Réessayez."));
        }
      }
    }
  };

  return (
    <main className="flex-center page-container">
      <Box
        className="flex-vertical contact-container"
        sx={{
          backgroundColor: (theme) => (theme.palette.mode === "dark" ? "var(--background-color-very-dark)" : "var(--transparent)"),
        }}
      >
        <div className="flex-center full-width">
          <h1>{t("Contactez-nous")}</h1>
        </div>
        <div className="flex-horizontal form-info-container">
          <div className="form-container">
            <form name="Contact" onSubmit={handleSubmit} acceptCharset="UTF-8">
              <label htmlFor="name">{t("Nom")}</label>
              <CustomTextField
                id="name"
                fullWidth
                size="small"
                className="input-spacing"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <label htmlFor="email">{t("Courriel")}</label>
              <CustomTextField
                id="email"
                fullWidth
                size="small"
                className="input-spacing"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
              />

              <label htmlFor="phone">{t("Téléphone")}</label>
              <CustomTextField
                id="phone"
                fullWidth
                size="small"
                className="input-spacing"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
                required
              />

              <label htmlFor="additional-info"></label>
              <CustomTextField
                id="additional-info"
                required
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
                lang={language}
                type="file"
                accept=".pdf,.dwg,.dxf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.skp,.rvt,.rfa,.rte,.pln,.tpl,.gsm,.ifc,.zip"
                onChange={handleFileUpload}
                className="input-spacing"
              />

              {error && <p className="error">{error}</p>}
              {document.map((file, i) => (
                <p key={i}>
                  {t("Fichier sélectionné")}: {file.name}
                </p>
              ))}

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
