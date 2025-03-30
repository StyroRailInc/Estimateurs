import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useMemo,
  SetStateAction,
  useEffect,
} from "react";
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
  const getMode = () => {
    const savedMode = localStorage.getItem("colorMode") as PaletteMode;
    if (savedMode && (savedMode === "light" || savedMode === "dark")) return savedMode;
    else return "light";
  };

  const [mode, setColorMode] = useState<PaletteMode>(getMode());

  useEffect(() => {
    setColorMode(getMode());
  }, []);

  useEffect(() => {
    localStorage.setItem("colorMode", mode);
  }, [mode]);

  const toggleColorMode = () => {
    setColorMode((prevMode) => (prevMode === "dark" ? "light" : "dark"));
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
