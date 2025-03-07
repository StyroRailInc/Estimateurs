import { SetStateAction, useState } from "react";
import Drawer from "@mui/material/Drawer";
import HomeIcon from "@mui/icons-material/Home";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import { IconButton } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LanguageIcon from "@mui/icons-material/Language";
import { useColorMode } from "src/context/ColorModeContext";
import LightMode from "@mui/icons-material/LightMode";
import DarkMode from "@mui/icons-material/DarkMode";
import { useLanguage } from "src/context/LanguageContext";
import ProfileIcon from "../ProfileIcon";
import FoundationIcon from "@mui/icons-material/Foundation";
import HouseSidingIcon from "@mui/icons-material/HouseSiding";
import "./../../global.css";
import "./AppBar.css";
import CustomListItem from "../CustomListItem";

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
        <div id="presentation" role="presentation">
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
