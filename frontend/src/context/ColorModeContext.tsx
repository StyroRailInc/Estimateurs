import { createContext, ReactNode, useContext, useState, useMemo, SetStateAction } from "react";
import { PaletteMode } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material";
import getDesignTokens from "./../themes/getDesignTokens";

const ColorModeContext = createContext<{
  mode: PaletteMode;
  toggleColorMode: () => void;
  setColorMode: React.Dispatch<SetStateAction<PaletteMode>>;
}>({
  mode: "light",
  toggleColorMode: () => {},
  setColorMode: () => {},
});

interface ColorModeProviderProps {
  children: ReactNode;
}

const ColorModeProvider: React.FC<ColorModeProviderProps> = ({ children }) => {
  const [mode, setColorMode] = useState<PaletteMode>("light");

  const toggleColorMode = () => {
    setColorMode(mode === "dark" ? "light" : "dark");
  };

  const value = { mode, toggleColorMode, setColorMode };

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ColorModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export const useColorMode = () => useContext(ColorModeContext);

export default ColorModeProvider;
