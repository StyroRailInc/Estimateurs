import React, { useEffect, useState, useTransition } from "react";
import { useTranslation } from "react-i18next";
import { Constants } from "src/constants";
import {
  List,
  ListItemButton,
  ListItemText,
  IconButton,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ListItem,
} from "@mui/material";
import { useAuth } from "src/context/AuthContext";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import "./BuildBlockSubmissions.css";
import { useNavigate } from "react-router-dom";
import "./../../global.css";

const BuildBlockSubmissions: React.FC = () => {
  const { t } = useTranslation();
  const [submissions, setSubmissions] = useState<
    { name: string; submission: string }[] | undefined
  >(undefined);
  const { user } = useAuth();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newName, setNewName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${Constants.API}/compute/buildblock/submissions?email=${user?.email}`, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: user ? user.token : "null" },
    })
      .then(async (response) => {
        if (response.ok) {
          const sub = await response.json();
          setSubmissions(sub);
          console.log(sub);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setNewName(submissions ? submissions[index].name : "");
  };

  const handleSubmissionClick = (index: number) => {
    if (!submissions) return;
    sessionStorage.setItem("buildblock-estimation", submissions[index].submission);
    sessionStorage.setItem("buildblock-estimation-name", submissions[index].name);
    navigate("/buildblock");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editingIndex === null || !submissions) return;
    const updatedSubmissions = [...submissions];
    updatedSubmissions[editingIndex].name = newName;

    fetch(`${Constants.API}/compute/buildblock/submissions?email=${user?.email}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: user ? user.token : "null" },
      body: JSON.stringify(updatedSubmissions),
    })
      .then((response) => {
        if (response.ok) {
          setSubmissions(updatedSubmissions);
          setEditingIndex(null);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDelete = (index: number) => {
    let name = "";
    const updatedSubmissions = submissions?.filter((submission, i) => {
      if (i === index) {
        name = submission.name;
      }
      return i !== index;
    });
    fetch(`${Constants.API}/compute/buildblock/submissions?email=${user?.email}&name=${name}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: user ? user.token : "null" },
    })
      .then((response) => {
        if (response.ok) {
          setSubmissions(updatedSubmissions);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        {t("Mes soumissions Build Block")}
      </h1>
      <List
        className="buildblock-submission-list"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? "var(--transparent)"
              : "var(--background-color-very-dark)",
          borderRadius: "8px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        {submissions?.length ? (
          submissions.map((submission, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <div>
                  <IconButton
                    edge="end"
                    onClick={() => handleEdit(index)}
                    aria-label={t("Modifier")}
                  >
                    <EditIcon sx={{ color: "#1976d2" }} />
                  </IconButton>
                  <IconButton
                    edge="end"
                    onClick={() => handleDelete(index)}
                    aria-label={t("Supprimer")}
                  >
                    <DeleteIcon sx={{ color: "#d32f2f" }} />
                  </IconButton>
                </div>
              }
              disablePadding
            >
              <ListItemButton onClick={() => handleSubmissionClick(index)}>
                <ListItemText primary={submission.name} />
              </ListItemButton>
            </ListItem>
          ))
        ) : (
          <p style={{ marginLeft: "20px" }}>{t("Vous n'avez aucune soumission")}</p>
        )}
      </List>

      <Dialog open={editingIndex !== null} onClose={() => setEditingIndex(null)} fullWidth>
        <DialogTitle>{t("Modifier le nom")}</DialogTitle>
        <form name="save-submission-modification" onSubmit={handleSubmit} acceptCharset="UTF-8">
          <DialogContent>
            <TextField
              id="name"
              fullWidth
              placeholder={t("Entrez un nouveau nom")}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              size="small"
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditingIndex(null)} color="error" variant="outlined">
              {t("Annuler")}
            </Button>
            <Button type="submit" color="secondary" variant="outlined">
              {t("Enregistrer")}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default BuildBlockSubmissions;
