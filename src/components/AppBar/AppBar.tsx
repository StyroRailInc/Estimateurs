import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import { Link, Outlet } from "react-router-dom";
import "./AppBar.css";

import LinkButton from "../LinkButton";
import "./../../global.css";
import { Button } from "@mui/material";

export default function ButtonAppBar() {
  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          height: "48px !important", // Force the height
        }}
      >
        <Toolbar
          sx={{
            height: "48px !important", // Force the height
            padding: "0 16px",
            minHeight: "48px !important", // Override minHeight
          }}
        >
          <div className="left-container">
            <img src="/styro.png" alt="Company-logo" className="image"></img>
            <p>STYRORAIL</p>
          </div>
          <div className="center-container">
            <LinkButton to={"/"}>Accueil</LinkButton>
            <LinkButton to={"/buildblock"}>Build Block</LinkButton>
            <LinkButton to={"/srf"}>SR-F</LinkButton>
            <LinkButton to={"/contact"}>Contact</LinkButton>
          </div>
          <div className="right-container">
            <Button color="secondary">ENG</Button>
          </div>
        </Toolbar>
      </AppBar>
      <Outlet /> {/* Renders child routes */}
    </>
  );
}
