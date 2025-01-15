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

const StyledButton = styled(Button)<{ isSelected: boolean }>(({ theme, isSelected }) => ({
  backgroundColor: isSelected
    ? theme.palette.mode === "light"
      ? "white"
      : "#404249"
    : "transparent",
  "&:hover": {
    backgroundColor: theme.palette.mode === "light" ? "#e6e6e6" : "#36373c",
  },
  color: theme.palette.text.primary,
}));

const LeftMenu: React.FC<LeftMenuProps> = ({ activeSection, onChangeSection }) => {
  const { t } = useTranslation();

  return (
    <div className="left-menu">
      <StyledButton
        fullWidth
        className="button-left-aligned padding-left button-centered"
        isSelected={activeSection === "buildBlockForm"}
        onClick={() => {
          onChangeSection("buildBlockForm");
        }}
      >
        Build Block
      </StyledButton>
      <StyledButton
        fullWidth
        className="button-left-aligned padding-left button-centered"
        isSelected={activeSection === "buildDeckForm"}
        onClick={() => {
          onChangeSection("buildDeckForm");
        }}
      >
        Build Deck
      </StyledButton>
      <StyledButton
        fullWidth
        className="button-left-aligned padding-left button-centered"
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
