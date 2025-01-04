import { useNavigate } from "react-router-dom";
import { useAuth } from "src/context/AuthContext";
import { IconButton } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useEffect } from "react";

const ProfileIcon = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (user) {
      navigate("/account");
    } else {
      navigate("/login");
    }
  };

  return (
    <IconButton onClick={handleProfileClick}>
      <AccountCircleIcon />
    </IconButton>
  );
};

export default ProfileIcon;
