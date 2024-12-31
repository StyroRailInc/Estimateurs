import React, { useContext, useState } from "react";
import "./App.css";
import { ThemeProvider, Button, TextField, PaletteMode, createTheme } from "@mui/material";
import getDesignTokens from "./themes/getDesignTokens";
import { CssBaseline } from "@mui/material/";
import BuildBlock from "./screens/BuildBlock";
import { StyledEngineProvider } from "@mui/material/styles";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SRF from "./screens/SRF";
import NoPage from "./screens/NoPage/NoPage";
import AppBar from "./../src/components/AppBar";
import Home from "./screens/Home";
import Contact from "./screens/Contact";
import ColorModeContext from "./context/ColorModeContext";
import Login from "./screens/Login";
import SignUp from "./screens/SignUp";

function App() {
  const colorMode = useContext(ColorModeContext);
  const [mode, setMode] = useState<PaletteMode>(colorMode.mode);
  const value = { mode, setMode };

  // Update the theme only if the mode changes.
  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ColorModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline>
          <StyledEngineProvider injectFirst>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<AppBar />}>
                  <Route index element={<Home />} />
                  <Route path="buildblock" element={<BuildBlock />} />
                  <Route path="srf" element={<SRF />} />
                  <Route path="contact" element={<Contact />} />
                  <Route path="login" element={<Login />} />
                  <Route path="sign-up" element={<SignUp />} />
                  <Route path="*" element={<NoPage />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </StyledEngineProvider>
        </CssBaseline>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
