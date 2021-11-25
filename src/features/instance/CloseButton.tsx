import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import { ReactUtils } from "common";

export function CloseButton(): JSX.Element {
  const navigateToParent = ReactUtils.useNavigateToParent();
  return (
    <IconButton sx={{ justifyContent: "right" }} onClick={navigateToParent}>
      <CloseIcon />
    </IconButton>
  );
}
