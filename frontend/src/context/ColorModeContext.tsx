import { createContext, ReactNode, useContext, useState, useMemo } from "react";
import { PaletteMode } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material";
import getDesignTokens from "./../themes/getDesignTokens";

const ColorModeContext = createContext<{
  mode: PaletteMode;
  toggleColorMode: () => void;
}>({
  mode: "light",
  toggleColorMode: () => {},
});

interface ColorModeProviderProps {
  children: ReactNode;
}

const ColorModeProvider: React.FC<ColorModeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<PaletteMode>("light");

  const toggleColorMode = () => {
    setMode(mode === "dark" ? "light" : "dark");
  };

  const value = { mode, toggleColorMode };

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ColorModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export const useColorMode = () => useContext(ColorModeContext);

export default ColorModeProvider;
