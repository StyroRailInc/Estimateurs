import React, { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "src/context/AuthContext";

interface ProfileIconProps {
  ButtonComponent: ReactNode;
}

const ProfileIcon: React.FC<ProfileIconProps> = ({ ButtonComponent }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (user) {
      navigate("/account");
    } else {
      navigate("/login");
    }
  };

  return React.cloneElement(ButtonComponent as React.ReactElement, {
    onClick: handleProfileClick,
  });
};

export default ProfileIcon;
