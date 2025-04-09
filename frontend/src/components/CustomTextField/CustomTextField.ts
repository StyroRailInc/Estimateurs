import { styled } from "@mui/material/styles";
import { TextField } from "@mui/material";
import "./../../global.css";

const CustomTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.text.primary,
    },
  },
}));

export default CustomTextField;
