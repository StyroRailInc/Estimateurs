import React, { Dispatch } from "react";
import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import "./../../BuildBlock.css";
import "./../../../../global.css";
import "./LeftMenu.css";

interface LeftMenuProps {
  activeSection: string;
  onChangeSection: Dispatch<React.SetStateAction<string>>;
}

// Styled button for conditional styling lowercase to supress warning
const StyledButton = styled(Button)<{ isSelected: boolean }>(({ isSelected }) => ({
  backgroundColor: isSelected ? "white" : "transparent",
  "&:hover": {
    backgroundColor: "#e6e6e6",
  },
}));

const LeftMenu: React.FC<LeftMenuProps> = ({ activeSection, onChangeSection }) => {
  const { t } = useTranslation();

  return (
    <div className="flex-vertical" style={{ width: 150 }}>
      <StyledButton
        fullWidth
        className="button-left-aligned padding-left"
        isSelected={activeSection === "buildBlockForm"}
        onClick={() => {
          onChangeSection("buildBlockForm");
        }}
      >
        Build Block
      </StyledButton>
      <StyledButton
        fullWidth
        className="button-left-aligned padding-left"
        isSelected={activeSection === "buildDeckForm"}
        onClick={() => {
          onChangeSection("buildDeckForm");
        }}
      >
        Build Deck
      </StyledButton>
      <StyledButton
        fullWidth
        className="button-left-aligned padding-left"
        isSelected={activeSection === "summary"}
        onClick={() => {
          onChangeSection("summary");
        }}
      >
        {t("Sommaire")}
      </StyledButton>
    </div>
  );
};

export default LeftMenu;
