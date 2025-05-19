import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Box, Button, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import "./../../global.css";
import "./Contact.css";
import { apiService } from "src/services/api";
import { useLanguage } from "src/context/LanguageContext";
import { HttpError } from "src/utils/http-error";
import { HTTP_STATUS } from "src/utils/http";
import CustomTextField from "src/components/CustomTextField";
import { Constants } from "src/constants";
import { Endpoints } from "src/interfaces/endpoints";

export default function Contact() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    additionalInfo: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);

  const computeTotalFileSize = useCallback(() => {
    const totalFileSize = files.reduce((size, file, i) => {
      return (size += file.size);
    }, 0);

    return totalFileSize;
  }, [files]);

  useEffect(() => {
    if (computeTotalFileSize() < Constants.MAX_FILE_SIZE) setError("");
    else setError(t("Les fichiers sont trop volumineux. La taille maximale est de 5 MB"));
  }, [files]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setFiles([...files, file]);

      if (!Constants.FILE_FORMATS.includes(file.type)) {
        setError(t("Format non supporté. Veuillez télécharger un fichier valide"));
        return;
      }

      setError("");
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (error) return;
    try {
      await apiService.fileUpload(Endpoints.CONTACT, files, formData);
      setSuccess(true);
    } catch (error) {
      const status = (error as HttpError)?.status;
      console.error(status === HTTP_STATUS.BAD_REQUEST ? "Missing information to send email" : "Failed to send. Please try again.");
    }
  };

  const renderTextField = (id: keyof typeof formData, label: string, type: string = "text", multiline = false) => (
    <>
      <label htmlFor={id}>{label}</label>
      <CustomTextField
        id={id}
        fullWidth
        size="small"
        className="input-spacing"
        value={formData[id]}
        onChange={handleChange(id)}
        type={type}
        multiline={multiline}
        rows={multiline ? 4 : undefined}
        required
      />
    </>
  );

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
            {success ? (
              <div className="flex-vertical">
                <h2>{t("Merci pour votre message!")}</h2>
                <p>{t("Nous avons bien reçu votre demande et vous contacterons sous peu")}</p>
              </div>
            ) : (
              <form name="Contact" onSubmit={handleSubmit} acceptCharset="UTF-8">
                {renderTextField("name", t("Nom"))}
                {renderTextField("email", t("Courriel"), "email")}
                {renderTextField("phone", t("Téléphone"), "tel")}
                {renderTextField("additionalInfo", "", "text", true)}

                <label htmlFor="document">{t("Télécharger un plan")}</label>
                <input
                  id="document"
                  lang={language}
                  type="file"
                  accept={Constants.FILE_EXTENSIONS}
                  onChange={handleFileUpload}
                  multiple
                  className="input-spacing"
                />

                {error && <p className="error">{error}</p>}

                <div className="file-list">
                  {files.map((file, i) => (
                    <div key={i} className="flex-space-between file-preview">
                      <p>
                        {t("Fichier sélectionné")}: {file.name}
                      </p>
                      <IconButton aria-label="delete" onClick={() => removeFile(i)} size="small">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </div>
                  ))}
                </div>

                <div className="flex-end">
                  <Button type="submit" variant="contained" color="secondary">
                    {t("Envoyer")}
                  </Button>
                </div>
              </form>
            )}
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
