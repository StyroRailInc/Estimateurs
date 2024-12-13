import { styled } from "@mui/material/styles";
import { Link as RouterLink } from "react-router-dom";
import { Button } from "@mui/material";
import { ReactNode } from "react";
import { ButtonProps } from "@mui/material";
import { LinkProps } from "react-router-dom";
import "./../../global.css";

interface LinkButtonProps extends ButtonProps {
  to: LinkProps["to"];
  children: ReactNode | ReactNode[];
  props?: ButtonProps;
}

const LinkButton: React.FC<LinkButtonProps> = ({ to, children, props }) => {
  return (
    <Button
      color="secondary"
      fullWidth
      component={RouterLink}
      to={to}
      className="button-no-caps"
      {...props}
      sx={{ color: "white" }}
    >
      {children}
    </Button>
  );
};

export default LinkButton;
