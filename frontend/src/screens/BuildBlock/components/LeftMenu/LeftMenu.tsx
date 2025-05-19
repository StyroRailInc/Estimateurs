import React, { Dispatch } from "react";
import { useTranslation } from "react-i18next";
import "./../../BuildBlock.css";
import "./../../../../global.css";
import "./LeftMenu.css";
import { Routes } from "src/interfaces/routes";
import StyledButton from "src/components/StyledButton";

interface LeftMenuProps {
  activeSection: string;
  onChangeSection: Dispatch<React.SetStateAction<string>>;
}

const LeftMenu: React.FC<LeftMenuProps> = ({ activeSection, onChangeSection }) => {
  const { t } = useTranslation();

  return (
    <div className="left-menu">
      <StyledButton
        fullWidth
        className="button-left-aligned padding-left button-centered"
        isSelected={activeSection === Routes.BUILDBLOCK_FORM}
        onClick={() => {
          onChangeSection(Routes.BUILDBLOCK_FORM);
        }}
      >
        Build Block
      </StyledButton>
      <StyledButton
        fullWidth
        className="button-left-aligned padding-left button-centered"
        isSelected={activeSection === Routes.SUMMARY}
        onClick={() => {
          onChangeSection(Routes.SUMMARY);
        }}
      >
        {t("Sommaire")}
      </StyledButton>
    </div>
  );
};

export default LeftMenu;
