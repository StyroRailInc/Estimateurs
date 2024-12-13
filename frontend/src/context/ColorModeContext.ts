import { createContext } from "react";
import { PaletteMode } from "@mui/material";

const ColorModeContext = createContext<{
  mode: PaletteMode;
  setMode: React.Dispatch<React.SetStateAction<PaletteMode>>;
}>({
  mode: "light",
  setMode: () => {},
});

export default ColorModeContext;
