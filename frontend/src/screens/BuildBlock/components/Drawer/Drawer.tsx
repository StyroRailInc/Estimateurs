import React, { Children, useState } from "react";
import { Button } from "@mui/material";
import "./../../BuildBlock.css";

interface DrawerProps {
  title: string;
  isOpen: boolean;
  children: React.ReactNode[] | React.ReactNode;
}

const Drawer: React.FC<DrawerProps> = ({ title, isOpen = true, children }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(isOpen);

  return (
    <div style={{ marginTop: 20 }}>
      <Button
        fullWidth
        className="button-left-aligned medium-font-size"
        onClick={() => {
          setIsDrawerOpen((prev) => !prev);
        }}
        sx={{
          color: (theme) => theme.palette.text.primary,
        }}
      >
        {title}
      </Button>
      {isDrawerOpen && children}
    </div>
  );
};

export default Drawer;
