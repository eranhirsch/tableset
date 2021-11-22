import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";

export function CloseButton(): JSX.Element {
  const navigate = useNavigate();
  return (
    <IconButton
      sx={{ justifyContent: "right" }}
      onClick={() => navigate(`/instance`)}
    >
      <CloseIcon />
    </IconButton>
  );
}
