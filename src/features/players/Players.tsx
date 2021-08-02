import { Chip, IconButton, TextField } from "@material-ui/core";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { addPlayer, removePlayer, selectPlayers } from "./playersSlice";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import PersonIcon from "@material-ui/icons/Person";
import { useState } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import { defineFixedStrategy, selectTemplate } from "../template/templateSlice";
import { Strategy } from "../../core/Strategy";

export default function Players({
  playerCount: { min: minPlayerCount, max: maxPlayerCount },
}: {
  playerCount: { min: number; max: number };
}) {
  const players = useAppSelector(selectPlayers);
  const template = useAppSelector(selectTemplate);
  const dispatch = useAppDispatch();
  const [newPlayerName, setNewPlayerName] = useState("");

  const removeRemovedPlayerFromTemplate = (name: string) => {
    const startingPlayerStep = template.find(
      (step) => step.name === "startingPlayer"
    );
    if (
      startingPlayerStep?.strategy === Strategy.FIXED &&
      startingPlayerStep.value === name
    ) {
      dispatch(defineFixedStrategy({ name: "startingPlayer" }));
    }
  };

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
              ? () => {
                  dispatch(removePlayer(name));
                  removeRemovedPlayerFromTemplate(name);
                }
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
