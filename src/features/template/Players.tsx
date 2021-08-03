import { Chip, IconButton, TextField } from "@material-ui/core";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import PersonIcon from "@material-ui/icons/Person";
import { useState } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import { addPlayer, removePlayer, selectPlayers } from "./templateSlice";

export default function Players({
  playerCount: { min: minPlayerCount, max: maxPlayerCount },
}: {
  playerCount: { min: number; max: number };
}) {
  const players = useAppSelector(selectPlayers);
  const dispatch = useAppDispatch();
  const [newPlayerName, setNewPlayerName] = useState("");

  return (
    <section>
      {players.map(({ name }) => (
        <Chip
          key={name}
          avatar={<PersonIcon />}
          label={name}
          onDelete={
            // Turn off onDelete to prevent player count from dropping below
            // allowed minimum
            players.length > minPlayerCount
              ? () => dispatch(removePlayer(name))
              : undefined
          }
        />
      ))}
      {players.length < maxPlayerCount && (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            dispatch(addPlayer(newPlayerName));
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
      )}
    </section>
  );
}
