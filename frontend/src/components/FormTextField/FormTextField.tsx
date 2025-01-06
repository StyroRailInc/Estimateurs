import { styled } from "@mui/material/styles";
import { TextField } from "@mui/material";
import "./../../global.css";

const FormTextField = styled(TextField)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "var(--text-input-dark)" : "var(--transparent)",
  borderRadius: "4px",
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "transparent",
    },
    "&:hover fieldset": {
      borderColor: "gray",
    },
    "&.Mui-focused fieldset": {
      borderColor: "gray",
    },
  },
}));

export default FormTextField;
