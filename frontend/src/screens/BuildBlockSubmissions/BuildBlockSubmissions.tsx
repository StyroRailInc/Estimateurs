import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Constants } from "src/constants";
import { List, ListItemButton, ListItemText, IconButton, TextField, ListItem } from "@mui/material";
import { useAuth } from "src/context/AuthContext";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import "./BuildBlockSubmissions.css";
import { useNavigate } from "react-router-dom";
import "./../../global.css";
import SingleInputDialog from "src/components/SingleInputDialog";
import { HTTP_STATUS } from "src/utils/http";

const BuildBlockSubmissions: React.FC = () => {
  const { t } = useTranslation();
  const [submissions, setSubmissions] = useState<
    { name: string; submission: string }[] | undefined
  >(undefined);
  const { user } = useAuth();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newName, setNewName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${Constants.API}/compute/buildblock/submissions?email=${user?.email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user ? user.token : "null"}`,
      },
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
    const oldName = updatedSubmissions[editingIndex].name;
    updatedSubmissions[editingIndex].name = newName;

    fetch(`${Constants.API}/compute/buildblock/submissions?email=${user?.email}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user ? user.token : "null"}`,
      },
      body: JSON.stringify({ submissions: updatedSubmissions }),
    })
      .then((response) => {
        if (response.ok) {
          setSubmissions(updatedSubmissions);
          setEditingIndex(null);
        } else {
          if (response.status === HTTP_STATUS.CONFLICT) {
            updatedSubmissions[editingIndex].name = oldName;
            setError("Une soumission avec ce nom existe déjà. Veuillez choisir un autre nom");
          }
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
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user ? user.token : "null"}`,
      },
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
    <main>
      <div style={{ padding: "20px" }}>
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
