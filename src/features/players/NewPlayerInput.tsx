import ClearIcon from "@mui/icons-material/Clear";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { IconButton, TextField } from "@mui/material";
import { useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { playersActions } from "./playersSlice";

export function NewPlayerInput(): JSX.Element | null {
  const dispatch = useAppDispatch();

  const [newPlayerName, setNewPlayerName] = useState("");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const submittedName = newPlayerName.trim();
        if (submittedName === "") {
          // Ignore trivial cases
          return;
        }
        dispatch(playersActions.added(submittedName));
        setNewPlayerName("");
      }}
    >
      <TextField
        InputProps={{
          startAdornment: <PersonAddIcon sx={{ mr: 1 }} />,
          endAdornment:
            newPlayerName !== "" ? (
              <IconButton onClick={() => setNewPlayerName("")}>
                <ClearIcon fontSize="small" />
              </IconButton>
            ) : undefined,
        }}
        placeholder="Add Player"
        id="playerName"
        size="small"
        margin="dense"
        fullWidth
        value={newPlayerName}
        onChange={(event) => setNewPlayerName(event.target.value)}
      />
    </form>
  );
}
