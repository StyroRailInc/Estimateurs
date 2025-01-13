import { ReactNode, useState } from "react";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import { CSSProperties } from "react";

interface CustomListItemProps {
  title: string;
  icon?: ReactNode;
  to?: string;
  style?: CSSProperties;
  onClick?: () => void;
}

const CustomListItem: React.FC<CustomListItemProps> = ({ title, icon, to, style, onClick }) => {
  const { t } = useTranslation();
  return (
    <ListItem disablePadding>
      {to ? (
        <ListItemButton component={RouterLink} to={to} style={style}>
          {icon && <ListItemIcon>{icon}</ListItemIcon>}
          <ListItemText primary={t(title)} />
        </ListItemButton>
      ) : (
        <ListItemButton onClick={onClick} style={style}>
          {icon && <ListItemIcon>{icon}</ListItemIcon>}
          <ListItemText primary={t(title)} />
        </ListItemButton>
      )}
    </ListItem>
  );
};

export default CustomListItem;
