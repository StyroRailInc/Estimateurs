import { styled } from "@mui/material/styles";
import { TextField } from "@mui/material";

const CustomTextField = styled(TextField)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[800] : "#ffffff",
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

export default CustomTextField;
