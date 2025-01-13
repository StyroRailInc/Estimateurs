import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";
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
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

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

  const handleChange = (event: React.SyntheticEvent, index: number) => {
    wallDispatch({
      type: "modifyWall",
      payload: {
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
        buildBlockFormState: buildBlockFormState,
        openingState: openingState,
        index: wallState.clickedWallIndex,
      },
    });
  }, [buildBlockFormState, openingState]);

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
          overflow: "scroll",
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
          {wallState.walls.map((_, index) => (
            <Tab key={index} value={index} label={`Wall ${index + 1}`} />
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
    </div>
  );
};

export default WallTab;
