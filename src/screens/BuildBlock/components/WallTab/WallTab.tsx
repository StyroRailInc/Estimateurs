import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { wallReducer, initialWallState } from "../../reducer";
import { useEffect, useReducer } from "react";
import "./../../../../global.css";
import { useTranslation } from "react-i18next";
import {
  OpeningState,
  BuildBlockFormState,
  BuildBlockFormAction,
  OpeningAction,
} from "../../types/BBTypes";

interface WallTabProps {
  buildBlockFormState: BuildBlockFormState;
  openingState: OpeningState;
  buildBlockFormDispatch: React.Dispatch<BuildBlockFormAction>;
  openingDispatch: React.Dispatch<OpeningAction>;
}

const StyledButton = styled(Button)<{ isSelected?: boolean }>(({ isSelected }) => ({
  backgroundColor: isSelected ? "#ffffff" : "#e0e0e0", // Lighter background
  color: isSelected ? "var(--secondary-color-light)" : "#333", // Blue for selected state
  "&:hover": {
    backgroundColor: isSelected ? "#ffffff" : "#c0c0c0", // Slightly darker on hover
    boxShadow: isSelected ? "0 2px 8px rgba(0, 0, 0, 0.2)" : "none", // Subtle shadow on hover
  },
  // padding: "10px 15px", // Consistent padding
  borderRadius: "4px",
  border: "1px solid",
  borderColor: isSelected ? "var(--secondary-color-light)" : "#bdbdbd",
  fontSize: "1rem",
  textTransform: "none",
  marginRight: "10px",
}));

const WallTab: React.FC<WallTabProps> = ({
  buildBlockFormState,
  openingState,
  buildBlockFormDispatch,
  openingDispatch,
}) => {
  const { t } = useTranslation();
  const [wallState, wallDispatch] = useReducer(wallReducer, initialWallState);

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

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "stretch",
        width: "100%",
        padding: "10px 0",
        borderBottom: "2px solid #ddd",
        // overflowX: "scroll",
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

      <Button
        onClick={handleAddWallTabClick}
        disableRipple
        color={"success"}
        variant="contained"
        disableElevation
      >
        +
      </Button>
    </div>
  );
};

export default WallTab;
