import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "isSelected",
})<{ isSelected: boolean }>(({ theme, isSelected }) => ({
  backgroundColor: isSelected ? (theme.palette.mode === "light" ? "white" : "#404249") : "transparent",
  "&:hover": {
    backgroundColor: theme.palette.mode === "light" ? "#e6e6e6" : "#36373c",
  },
  color: theme.palette.text.primary,
}));
