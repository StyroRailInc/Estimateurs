import React, { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "src/context/AuthContext";
import { Routes } from "./../../interfaces/routes";

interface ProfileIconProps {
  ButtonComponent: ReactNode;
}

const ProfileIcon: React.FC<ProfileIconProps> = ({ ButtonComponent }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (user) {
      navigate(Routes.ACCOUNT);
    } else {
      navigate(Routes.LOGIN);
    }
  };

  return React.cloneElement(ButtonComponent as React.ReactElement, {
    onClick: handleProfileClick,
  });
};

export default ProfileIcon;
