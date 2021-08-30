import { IconButton, TextField } from "@material-ui/core";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import { useState } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import playersSlice from "./playersSlice";
import { gameIdSelector } from "../game/gameSlice";

export default function NewPlayerInput() {
  const dispatch = useAppDispatch();

  const gameId = useAppSelector(gameIdSelector);
  const [newPlayerName, setNewPlayerName] = useState("");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        dispatch(playersSlice.actions.added(newPlayerName, gameId));
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
