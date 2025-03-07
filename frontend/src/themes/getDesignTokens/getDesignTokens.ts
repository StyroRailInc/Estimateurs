import { PaletteMode } from "@mui/material";

const getDesignTokens = (mode: PaletteMode) => ({
  components: {
    MuiButtonBase: {
      defaultProps: {
        // disableRipple: true, // Disables ripple effect for all buttons
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
    },
  },
  palette: {
    contrastThreshold: 4.5,
    mode,
    background: {
      ...(mode === "light"
        ? {
            default: "#f2f2f2",
          }
        : { default: "#313338" }),
    },
    primary: {
      ...(mode === "light"
        ? {
            main: "#3C5466",
          }
        : { main: "#232428" }),
    },
    secondary: {
      ...(mode === "light"
        ? {
            main: "#08ACEB",
          }
        : { main: "#08ACEB" }),
    },
    text: {
      ...(mode === "light"
        ? {
            primary: "#3C5466",
          }
        : {
            primary: "#c6c7ca",
          }),
    },
  },
});

export default getDesignTokens;
