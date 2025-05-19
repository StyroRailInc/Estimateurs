import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { List, ListItemButton, ListItemText, IconButton, TextField, ListItem } from "@mui/material";
import { useAuth } from "src/context/AuthContext";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import "./BuildBlockSubmissions.css";
import { useNavigate } from "react-router-dom";
import "./../../global.css";
import SingleInputDialog from "src/components/SingleInputDialog";
import { HTTP_STATUS } from "src/utils/http";
import FormTextField from "src/components/FormTextField";
import { Submissions } from "src/interfaces/submissions";
import { apiService } from "src/services/api";
import { Routes } from "src/interfaces/routes";
import { HttpError } from "src/utils/http-error";
import { Endpoints } from "src/interfaces/endpoints";

const BuildBlockSubmissions: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [newName, setNewName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [submissions, setSubmissions] = useState<Submissions[] | undefined>(undefined);

  useEffect(() => {
    async function fetchSubmissions() {
      try {
        const body = await apiService.get(`${Endpoints.SUBMISSIONS}${user?.email}`, user);
        setSubmissions(body);
      } catch (error) {
        console.error("There has been an error retrieving submissions");
      }
    }
    fetchSubmissions();
  }, []);

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setNewName(submissions ? submissions[index].name : "");
  };

  const handleSubmissionClick = (index: number) => {
    if (!submissions) return;
    sessionStorage.setItem("buildblock-estimation", submissions[index].submission);
    sessionStorage.setItem("buildblock-estimation-name", submissions[index].name);
    navigate(Routes.BUILDBLOCK);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editingIndex === null || !submissions) return;
    const updatedSubmissions = [...submissions];
    const oldName = updatedSubmissions[editingIndex].name;
    updatedSubmissions[editingIndex].name = newName;

    try {
      await apiService.put(`${Endpoints.SUBMISSIONS}${user?.email}`, { submissions: updatedSubmissions }, user);
      setSubmissions(updatedSubmissions);
      setEditingIndex(null);
    } catch (error) {
      const status = (error as HttpError)?.status;

      if (status === HTTP_STATUS.CONFLICT) {
        updatedSubmissions[editingIndex].name = oldName;
        setError("Une soumission avec ce nom existe déjà. Veuillez choisir un autre nom");
      } else {
        console.error("There has been an error updating submissions. Retry later");
      }
    }
  };

  const handleDelete = async (index: number) => {
    let name = "";
    const updatedSubmissions = submissions?.filter((submission, i) => {
      if (i === index) name = submission.name;
      return i !== index;
    });

    try {
      await apiService.delete(`${Endpoints.SUBMISSIONS}${user?.email}&name=${name}`, user);
      setSubmissions(updatedSubmissions);
    } catch (error) {}
  };

  const filteredSubmissions = submissions?.filter((submission) => submission.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <main>
      <div className="buildblock-submission-container">
        <h1 className="buildblock-submission-title">{t("Mes soumissions Build Block")}</h1>

        <FormTextField
          id="search-bar"
          fullWidth
          size="small"
          className="input-spacing"
          placeholder={t("Rechercher une soumission...")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <List
          className="buildblock-submission-list"
          sx={{
            backgroundColor: (theme) => (theme.palette.mode === "light" ? "var(--transparent)" : "var(--background-color-very-dark)"),
          }}
        >
          {filteredSubmissions?.length ? (
            filteredSubmissions.map((submission) => {
              const index = submissions?.findIndex((s) => s.name === submission.name) ?? -1;
              return (
                <ListItem
                  key={index}
                  secondaryAction={
                    <div>
                      <IconButton edge="end" onClick={() => handleEdit(index)} aria-label={t("Modifier")}>
                        <EditIcon className="edit-icon" />
                      </IconButton>
                      <IconButton edge="end" onClick={() => handleDelete(index)} aria-label={t("Supprimer")}>
                        <DeleteIcon className="delete-icon" />
                      </IconButton>
                    </div>
                  }
                  disablePadding
                >
                  <ListItemButton onClick={() => handleSubmissionClick(index)}>
                    <ListItemText primary={submission.name} />
                  </ListItemButton>
                </ListItem>
              );
            })
          ) : (
            <p className="no-submission-text">{t("Aucune soumission trouvée")}</p>
          )}
        </List>

        <SingleInputDialog
          title={"Modifier le nom"}
          open={editingIndex !== null}
          onClose={() => {
            setEditingIndex(null);
            setError("");
          }}
          onCancel={() => {
            setEditingIndex(null);
            setError("");
          }}
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            handleSubmit(e);
            setError("");
          }}
        >
          {error && <p className="error">{t(error)}</p>}
          <TextField
            id="name"
            fullWidth
            placeholder={t("Entrez un nouveau nom")}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            size="small"
            required
          />
        </SingleInputDialog>
      </div>
    </main>
  );
};

export default BuildBlockSubmissions;
