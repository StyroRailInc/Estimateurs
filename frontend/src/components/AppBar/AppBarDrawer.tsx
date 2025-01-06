import { ReactNode, useState } from "react";
import Drawer from "@mui/material/Drawer";
import HomeIcon from "@mui/icons-material/Home";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import { IconButton } from "@mui/material";
import { useTranslation } from "react-i18next";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LanguageIcon from "@mui/icons-material/Language";
import { useColorMode } from "src/context/ColorModeContext";
import LightMode from "@mui/icons-material/LightMode";
import DarkMode from "@mui/icons-material/DarkMode";
import { Link as RouterLink } from "react-router-dom";
import { useLanguage } from "src/context/LanguageContext";
import ProfileIcon from "../ProfileIcon";
import FoundationIcon from "@mui/icons-material/Foundation";
import HouseSidingIcon from "@mui/icons-material/HouseSiding";
import "./../../global.css";

interface CustomListItemProps {
  title: string;
  icon: ReactNode;
  to?: string;
  onClick?: () => void;
}

const CustomListItem: React.FC<CustomListItemProps> = ({ title, icon, to, onClick }) => {
  const { t } = useTranslation();
  return (
    <ListItem disablePadding>
      {to ? (
        <ListItemButton component={RouterLink} to={to}>
          <ListItemIcon>{icon}</ListItemIcon>
          <ListItemText primary={t(title)} />
        </ListItemButton>
      ) : (
        <ListItemButton onClick={onClick}>
          <ListItemIcon>{icon}</ListItemIcon>
          <ListItemText primary={t(title)} />
        </ListItemButton>
      )}
    </ListItem>
  );
};

const AppBarDrawer: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { mode, toggleColorMode } = useColorMode();
  const { language, toggleLanguage } = useLanguage();

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <div>
      <IconButton onClick={toggleDrawer(true)} sx={{ color: "var(--text-color-header)" }}>
        <MenuIcon />
      </IconButton>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        <div style={{ width: 250 }} role="presentation">
          <List onClick={toggleDrawer(false)}>
            <CustomListItem title="Accueil" icon={<HomeIcon />} to="/" />
            <CustomListItem title="Build Block" icon={<HouseSidingIcon />} to="/buildblock" />
            <CustomListItem title="SR-F" icon={<FoundationIcon />} to="/srf" />
            <CustomListItem title="Contact" icon={<MailIcon />} to="/contact" />
            <ProfileIcon
              ButtonComponent={<CustomListItem title="Compte" icon={<AccountCircleIcon />} />}
            />
          </List>
          <Divider />
          <List>
            <CustomListItem
              title={language === "fr" ? "Eng" : "Fr"}
              icon={<LanguageIcon />}
              onClick={toggleLanguage}
            />
            <CustomListItem
              title="Mode"
              icon={mode === "dark" ? <LightMode /> : <DarkMode />}
              onClick={toggleColorMode}
            />
          </List>
        </div>
      </Drawer>
    </div>
  );
};

export default AppBarDrawer;
