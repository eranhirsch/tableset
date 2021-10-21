import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { ResetDialog } from "./ResetDialog";

export function OverflowMenu(): JSX.Element {
  const [menuAnchorElement, setMenuAnchorElement] = useState<HTMLElement>();
  const [showResetDialog, setShowResetDialog] = useState(false);

  return (
    <>
      <IconButton
        color="inherit"
        onClick={(event) => setMenuAnchorElement(event.currentTarget)}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        open={menuAnchorElement != null}
        anchorEl={menuAnchorElement}
        onClose={() => setMenuAnchorElement(undefined)}
      >
        <MenuItem onClick={() => setShowResetDialog(true)}>Reset</MenuItem>
      </Menu>
      <ResetDialog
        open={showResetDialog}
        onClose={() => setShowResetDialog(false)}
      />
    </>
  );
}
