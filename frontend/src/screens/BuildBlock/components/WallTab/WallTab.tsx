import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import "./../../../../global.css";
import { useTranslation } from "react-i18next";
import { OpeningState, BuildBlockFormState, BuildBlockFormAction, OpeningAction, WallState, WallAction } from "../../types/BBTypes";
import { initialOpeningState, initialWallState } from "../../reducer";
import { Tab, Tabs, IconButton, TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SingleInputDialog from "src/components/SingleInputDialog";
import "./WallTab.css";

interface WallTabProps {
  buildBlockFormState: BuildBlockFormState;
  openingState: OpeningState;
  wallState: WallState;
  buildBlockFormDispatch: React.Dispatch<BuildBlockFormAction>;
  openingDispatch: React.Dispatch<OpeningAction>;
  wallDispatch: React.Dispatch<WallAction>;
}

const WallTab: React.FC<WallTabProps> = ({ buildBlockFormState, openingState, wallState, buildBlockFormDispatch, openingDispatch, wallDispatch }) => {
  const { t } = useTranslation();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newName, setNewName] = useState<string>("");

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
    dispatchModifyWall();
  }, [buildBlockFormState, openingState]);

  const dispatchModifyWall = (nameOverride?: string) => {
    wallDispatch({
      type: "modifyWall",
      payload: {
        name: nameOverride ?? wallState.walls[wallState.clickedWallIndex]?.name,
        buildBlockFormState,
        openingState,
        index: wallState.clickedWallIndex,
      },
    });
  };

  const handleChange = (event: React.SyntheticEvent, index: number) => {
    dispatchModifyWall();
    wallDispatch({ type: "setClickedWallIndex", payload: index });
  };

  const handleAddWallTabClick = () => {
    dispatchModifyWall();
    wallDispatch({ type: "addWall", payload: { buildBlockFormState, openingState } });
    wallDispatch({ type: "setClickedWallIndex", payload: wallState.walls.length });
  };

  const handleDeleteWallTabClick = () => {
    const { clickedWallIndex, walls } = wallState;
    if (walls.length === 1) {
      wallDispatch({ type: "setWalls", payload: initialWallState });
      openingDispatch({ type: "setOpenings", payload: initialOpeningState });
      buildBlockFormDispatch({ type: "resetInputs" });
      return;
    }

    const newClickedIndex = Math.min(clickedWallIndex, walls.length - 2);
    wallDispatch({ type: "setClickedWallIndex", payload: newClickedIndex });

    setTimeout(() => {
      const updatedWalls = walls.filter((_, index) => index !== clickedWallIndex);

      if (updatedWalls[newClickedIndex]) {
        buildBlockFormDispatch({
          type: "setInputs",
          payload: updatedWalls[newClickedIndex].buildBlockFormState,
        });

        openingDispatch({
          type: "setOpenings",
          payload: updatedWalls[newClickedIndex].openingState,
        });
      }

      wallDispatch({ type: "deleteWall", payload: { index: clickedWallIndex } });
    }, 0);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatchModifyWall(newName);
    setEditingIndex(null);
  };

  return (
    <div className="wall-tab-container">
      <div className="wall-tab-scroll-area">
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
                <div className="wall-tab-label">
                  <p>{wall.name}</p>
                  <IconButton component="span" edge="end" onClick={() => handleEdit(index)} aria-label={t("Modifier")}>
                    <EditIcon className="icon-small" />
                  </IconButton>
                </div>
              }
              className="button-no-caps"
            />
          ))}
        </Tabs>
      </div>

      <div className="wall-tab-controls">
        <Button onClick={handleAddWallTabClick} disableRipple color="success" variant="contained" className="wall-tab-add-btn">
          +
        </Button>
        <Button onClick={handleDeleteWallTabClick} disableRipple color="error" variant="contained">
          -
        </Button>
      </div>

      <SingleInputDialog
        title={t("Nom du mur")}
        open={editingIndex !== null}
        onClose={() => {
          setEditingIndex(null);
          setNewName("");
        }}
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          setNewName("");
          handleSubmit(e);
        }}
        onCancel={() => {
          setEditingIndex(null);
          setNewName("");
        }}
      >
        <TextField id="name" fullWidth value={newName} onChange={(e) => setNewName(e.target.value)} size="small" required />
      </SingleInputDialog>
    </div>
  );
};

export default WallTab;
