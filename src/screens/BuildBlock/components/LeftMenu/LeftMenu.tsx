import React, { Dispatch } from "react";
import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import "./../../BuildBlock.css";

interface LeftMenuProps {
  activeSection: string;
  onChangeSection: Dispatch<React.SetStateAction<string>>;
}

// Styled button for conditional styling
const StyledButton = styled(Button)<{ isSelected: boolean }>(({ isSelected }) => ({
  backgroundColor: isSelected ? "white" : "transparent",
  // color: isSelected ? "black" : "inherit",
  "&:hover": {
    backgroundColor: "#e6e6e6",
  },
}));

const LeftMenu: React.FC<LeftMenuProps> = ({ activeSection, onChangeSection }) => {
  return (
    <div className="flex-vertical" style={{ width: 150, position: "fixed", top: 145, left: 70 }}>
      <StyledButton
        fullWidth
        className="button-left-aligned"
        isSelected={activeSection === "buildBlockForm"}
        onClick={() => {
          onChangeSection("buildBlockForm");
        }}
        style={{ paddingLeft: 10 }}
      >
        Build Block
      </StyledButton>
      <StyledButton
        fullWidth
        className="button-left-aligned"
        isSelected={activeSection === "buildDeckForm"}
        onClick={() => {
          onChangeSection("buildDeckForm");
        }}
        style={{ paddingLeft: 10 }}
      >
        Build Deck
      </StyledButton>
      <StyledButton
        fullWidth
        className="button-left-aligned"
        isSelected={activeSection === "summary"}
        onClick={() => {
          onChangeSection("summary");
        }}
        style={{ paddingLeft: 10 }}
      >
        Sommaire
      </StyledButton>
    </div>
  );
};

export default LeftMenu;
