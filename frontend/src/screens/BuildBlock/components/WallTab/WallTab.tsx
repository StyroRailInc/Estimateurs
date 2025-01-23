import { Button } from "@mui/material";
import { useEffect, useReducer, useState } from "react";
import "./../../../../global.css";
import { useTranslation } from "react-i18next";
import {
  OpeningState,
  BuildBlockFormState,
  BuildBlockFormAction,
  OpeningAction,
  WallState,
  WallAction,
} from "../../types/BBTypes";
import { initialWallState } from "../../reducer";
import { Tab, Tabs, IconButton, TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SingleInputDialog from "src/components/SingleInputDialog";

interface WallTabProps {
  buildBlockFormState: BuildBlockFormState;
  openingState: OpeningState;
  wallState: WallState;
  buildBlockFormDispatch: React.Dispatch<BuildBlockFormAction>;
  openingDispatch: React.Dispatch<OpeningAction>;
  wallDispatch: React.Dispatch<WallAction>;
}

const WallTab: React.FC<WallTabProps> = ({
  buildBlockFormState,
  openingState,
  wallState,
  buildBlockFormDispatch,
  openingDispatch,
  wallDispatch,
}) => {
  const { t } = useTranslation();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newName, setNewName] = useState<string>("");

  const handleChange = (event: React.SyntheticEvent, index: number) => {
    wallDispatch({
      type: "modifyWall",
      payload: {
        name: wallState.walls[wallState.clickedWallIndex].name,
        buildBlockFormState: buildBlockFormState,
        openingState: openingState,
        index: wallState.clickedWallIndex,
      },
    });
    wallDispatch({ type: "setClickedWallIndex", payload: index });
  };

  const handleAddWallTabClick = () => {
    wallDispatch({
      type: "modifyWall",
      payload: {
        name: wallState.walls[wallState.clickedWallIndex].name,
        buildBlockFormState: buildBlockFormState,
        openingState: openingState,
        index: wallState.clickedWallIndex,
      },
    });
    wallDispatch({ type: "addWall", payload: { buildBlockFormState, openingState } });
    wallDispatch({ type: "setClickedWallIndex", payload: wallState.walls.length });
  };

  const handleDeleteWallTabClick = () => {
    const { clickedWallIndex, walls } = wallState;
    if (walls.length === 1) {
      wallDispatch({ type: "setWalls", payload: initialWallState });
      return;
    }
    wallDispatch({ type: "deleteWall", payload: { index: clickedWallIndex } });
    const newClickedIndex = Math.min(clickedWallIndex, walls.length - 2);
    wallDispatch({ type: "setClickedWallIndex", payload: newClickedIndex });
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
  };

  useEffect(() => {
    buildBlockFormDispatch({
      type: "setInputs",
      payload: wallState.walls[wallState.clickedWallIndex].buildBlockFormState,
    });
    openingDispatch({
      type: "setOpenings",
      payload: wallState.walls[wallState.clickedWallIndex].openingState,
    });
  }, [wallState.clickedWallIndex]);

  useEffect(() => {
    wallDispatch({
      type: "modifyWall",
      payload: {
        name: wallState.walls[wallState.clickedWallIndex].name,
        buildBlockFormState: buildBlockFormState,
        openingState: openingState,
        index: wallState.clickedWallIndex,
      },
    });
  }, [buildBlockFormState, openingState]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    wallDispatch({
      type: "modifyWall",
      payload: {
        name: newName,
        buildBlockFormState: buildBlockFormState,
        openingState: openingState,
        index: wallState.clickedWallIndex,
      },
    });
    setEditingIndex(null);
  };

  return (
    <div
      className="flex-horizontal flex-start"
      style={{
        padding: "10px 0",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          width: "100%",
          overflow: "auto",
        }}
      >
        <Tabs
          value={wallState.clickedWallIndex}
          onChange={handleChange}
          textColor="secondary"
          indicatorColor="secondary"
          variant="scrollable"
          scrollButtons="auto"
        >
          {wallState.walls.map((wall, index) => (
            <Tab
              key={index}
              value={index}
              label={
                <div className="flex-horizontal">
                  <p>{wall.name}</p>
                  <IconButton
                    edge="end"
                    onClick={() => handleEdit(index)}
                    aria-label={t("Modifier")}
                  >
                    <EditIcon sx={{ width: "15px", height: "15px" }} />
                  </IconButton>
                </div>
              }
              className="button-no-caps"
            />
          ))}
        </Tabs>
      </div>

      <div className="flex-end">
        <Button
          onClick={handleAddWallTabClick}
          disableRipple
          color={"success"}
          variant="contained"
          sx={{ marginRight: "10px" }}
        >
          +
        </Button>
        <Button
          onClick={handleDeleteWallTabClick}
          disableRipple
          color={"error"}
          variant="contained"
        >
          -
        </Button>
      </div>

      <SingleInputDialog
        title="Nom du mur"
        open={editingIndex !== null}
        onClose={() => {
          setEditingIndex(null);
        }}
        onSubmit={handleSubmit}
        onCancel={() => {
          setEditingIndex(null);
        }}
      >
        <TextField
          id="name"
          fullWidth
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          size="small"
          required
        />
      </SingleInputDialog>
    </div>
  );
};

export default WallTab;
