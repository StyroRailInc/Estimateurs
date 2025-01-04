import { createContext, ReactNode, useContext, useState, useMemo } from "react";
import { PaletteMode } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material";
import getDesignTokens from "./../themes/getDesignTokens";

const ColorModeContext = createContext<{
  mode: PaletteMode;
  setMode: React.Dispatch<React.SetStateAction<PaletteMode>>;
}>({
  mode: "light",
  setMode: () => {},
});

interface ColorModeProviderProps {
  children: ReactNode;
}

const ColorModeProvider: React.FC<ColorModeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<PaletteMode>("light");

  const value = { mode, setMode };

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ColorModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export const useColorMode = () => useContext(ColorModeContext);

export default ColorModeProvider;
