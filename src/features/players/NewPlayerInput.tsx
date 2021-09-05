import { IconButton, TextField } from "@material-ui/core";
import { useAppDispatch } from "../../app/hooks";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import { useState } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import playersSlice from "./playersSlice";

export default function NewPlayerInput(): JSX.Element | null {
  const dispatch = useAppDispatch();

  const [newPlayerName, setNewPlayerName] = useState("");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        dispatch(playersSlice.actions.added(newPlayerName));
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
