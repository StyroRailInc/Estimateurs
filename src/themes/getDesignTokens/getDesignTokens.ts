import { grey } from "@mui/material/colors";
import { PaletteMode } from "@mui/material";

const getDesignTokens = (mode: PaletteMode) => ({
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true, // Disables ripple effect for all buttons
      },
    },
  },
  palette: {
    mode,
    background: {
      ...(mode === "light"
        ? {
            default: "#f2f2f2",
          }
        : { default: "#3C5466" }),
    },
    primary: {
      ...(mode === "light"
        ? {
            main: "#3C5466",
          }
        : { main: "#08ACEB" }),
    },
    secondary: {
      ...(mode === "light"
        ? {
            main: "#08ACEB",
          }
        : { main: "#f2f2f2" }),
    },
    text: {
      ...(mode === "light"
        ? {
            primary: "#3C5466",
            secondary: "#f2f2f2",
          }
        : {
            primary: "#ffffff",
            secondary: "#f2f2f2",
          }),
    },
  },
});

export default getDesignTokens;
