import React from "react";
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

const ColorModeContext = React.createContext({});

function App() {
  const [mode, setMode] = React.useState<PaletteMode>("light");
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode: PaletteMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  // Update the theme only if the mode changes
  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ColorModeContext.Provider value={mode}>
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
