import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { resetStateInLocalStorage } from "app/persist";
import { useHistory } from "react-router";

export function ResetDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose(): void;
}): JSX.Element {
  const history = useHistory();

  return (
    <Dialog open={open}>
      <DialogTitle>Reset?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Reset the app by completely deleting all stored data?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={() => {
            resetStateInLocalStorage();
            onClose();
            history.push("/");
          }}
          autoFocus
        >
          Reset
        </Button>
      </DialogActions>
    </Dialog>
  );
}
