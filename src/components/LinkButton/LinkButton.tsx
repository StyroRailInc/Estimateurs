import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import { ReactNode } from "react";
import { ButtonProps } from "@mui/material";
import { LinkProps } from "react-router-dom";
import "./../../global.css";

const ThemedLink = styled(Link)(({ theme }) => ({
  textDecoration: "none",
  color: theme.palette.mode === "dark" ? "#ffffff" : "#ffffff",
  ":hover": { color: theme.palette.mode === "dark" ? "#08ACEB" : "#08ACEB" },
}));

interface LinkButtonProps extends ButtonProps {
  to: LinkProps["to"];
  children: ReactNode | ReactNode[];
}

const LinkButton: React.FC<LinkButtonProps> = ({ to, children, ...props }) => {
  return (
    <Button {...props} disableTouchRipple fullWidth className="button-no-caps">
      <ThemedLink to={to}>{children}</ThemedLink>
    </Button>
  );
};

export default LinkButton;
