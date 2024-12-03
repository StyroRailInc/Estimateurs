import React, { Dispatch } from "react";
import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import "./../../BuildBlock.css";

interface LeftMenuProps {
  activeSection: string;
  onChangeSection: Dispatch<React.SetStateAction<string>>;
}

// Styled button for conditional styling lowercase to supress warning
const StyledButton = styled(Button)<{ isselected: string }>(({ isselected }) => ({
  backgroundColor: isselected === "true" ? "white" : "transparent",
  // color: isselected ? "black" : "inherit",
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
        isselected={activeSection === "buildBlockForm" ? "true" : "false"}
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
        isselected={activeSection === "buildDeckForm" ? "true" : "false"}
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
        isselected={activeSection === "summary" ? "true" : "false"}
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
