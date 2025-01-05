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

  const handleSave = () => {
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
    <>
      <p>{t("Mes soumissions buildblock")}</p>

      <List className="buildblock-submission-list">
        {submissions?.map((submission, index) => (
          <ListItem
            key={index}
            secondaryAction={
              <>
                <IconButton edge="end" onClick={() => handleEdit(index)}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" onClick={() => handleDelete(index)}>
                  <DeleteIcon />
                </IconButton>
              </>
            }
            disablePadding
          >
            <ListItemButton onClick={() => handleSubmissionClick(index)}>
              <ListItemText primary={submission.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Dialog open={editingIndex !== null} onClose={() => setEditingIndex(null)}>
        <DialogTitle>{t("Modifier le nom")}</DialogTitle>
        <DialogContent>
          <TextField
            id="name"
            fullWidth
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingIndex(null)}>{t("Annuler")}</Button>
          <Button onClick={handleSave} color="primary">
            {t("Enregistrer")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BuildBlockSubmissions;
