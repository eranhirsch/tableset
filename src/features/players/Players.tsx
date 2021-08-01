import { Chip, IconButton, TextField } from "@material-ui/core";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { addPlayer, removePlayer, selectPlayers } from "./playersSlice";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import PersonIcon from "@material-ui/icons/Person";
import { useState } from "react";

export default function Players() {
  const players = useAppSelector(selectPlayers);
  const dispatch = useAppDispatch();
  const [newPlayerName, setNewPlayerName] = useState<string | undefined>();

  return (
    <section>
      {players.map(({ name }) => (
        <Chip
          key={name}
          avatar={<PersonIcon />}
          label={name}
          onDelete={
            players.length > 2 ? () => dispatch(removePlayer(name)) : undefined
          }
        />
      ))}
      {players.length < 5 &&
        (newPlayerName != null ? (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              dispatch(addPlayer(newPlayerName));
              setNewPlayerName(undefined);
            }}
          >
            <TextField
              id="playerName"
              label="Name"
              size="small"
              margin="dense"
              fullWidth
              autoFocus
              value={newPlayerName}
              onBlur={() => setNewPlayerName(undefined)}
              onChange={(event) => setNewPlayerName(event.target.value)}
            />
          </form>
        ) : (
          <IconButton onClick={() => setNewPlayerName("")}>
            <PersonAddIcon />
          </IconButton>
        ))}
    </section>
  );
}
