import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useEffect, useReducer } from "react";
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

interface WallTabProps {
  buildBlockFormState: BuildBlockFormState;
  openingState: OpeningState;
  wallState: WallState;
  buildBlockFormDispatch: React.Dispatch<BuildBlockFormAction>;
  openingDispatch: React.Dispatch<OpeningAction>;
  wallDispatch: React.Dispatch<WallAction>;
}

const StyledButton = styled(Button)<{ isSelected?: boolean }>(({ isSelected }) => ({
  backgroundColor: isSelected ? "#ffffff" : "#e0e0e0", // Lighter background
  color: isSelected ? "var(--secondary-color-light)" : "#333", // Blue for selected state
  "&:hover": {
    backgroundColor: isSelected ? "#ffffff" : "#c0c0c0", // Slightly darker on hover
    boxShadow: isSelected ? "0 2px 8px rgba(0, 0, 0, 0.2)" : "none", // Subtle shadow on hover
  },
  borderRadius: "4px",
  border: "1px solid",
  borderColor: isSelected ? "var(--secondary-color-light)" : "#bdbdbd",
  fontSize: "1rem",
  textTransform: "none",
  marginRight: "10px",
  height: "40px",
}));

const WallTab: React.FC<WallTabProps> = ({
  buildBlockFormState,
  openingState,
  wallState,
  buildBlockFormDispatch,
  openingDispatch,
  wallDispatch,
}) => {
  const { t } = useTranslation();

  const handleWallTabClick = (index: number) => {
    wallDispatch({
      type: "modifyWall",
      payload: {
        buildBlockFormState: buildBlockFormState,
        openingState: openingState,
        index: wallState.clickedWallIndex,
      },
    });
    wallDispatch({ type: "setClickedWallIndex", payload: index });
    // scrollTo(()=>{}); scroll to end
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
      className="flex-horizontal"
      style={{
        display: "flex",
        justifyContent: "flex-start",
        width: "100%",
        padding: "10px 0",
        borderBottom: "2px solid #ddd",
        overflow: "auto",
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
        {wallState.walls.map((_, index) => (
          <StyledButton
            key={index}
            isSelected={wallState.clickedWallIndex === index}
            onClick={() => handleWallTabClick(index)}
          >
            {t("Mur") + " " + (index + 1)}
          </StyledButton>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          onClick={handleAddWallTabClick}
          disableRipple
          color={"success"}
          variant="contained"
          disableElevation
          style={{ marginRight: "10px" }}
        >
          +
        </Button>
        <Button
          onClick={handleDeleteWallTabClick}
          disableRipple
          color={"error"}
          variant="contained"
          disableElevation
        >
          -
        </Button>
      </div>
    </div>
  );
};

export default WallTab;
