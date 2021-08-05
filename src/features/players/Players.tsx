import { Chip, IconButton, TextField } from "@material-ui/core";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import PersonIcon from "@material-ui/icons/Person";
import { useState } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import {
  playerAdded,
  playerRemoved,
  selectPlayerById,
  selectPlayerIds,
} from "./playersSlice";
import { EntityId } from "@reduxjs/toolkit";
import useAppIdSelectorEnforce from "../../common/hooks/useAppIdSelectorEnforce";

function Player({
  playerId,
  isDeletable,
}: {
  playerId: EntityId;
  isDeletable: boolean;
}) {
  const dispatch = useAppDispatch();

  const player = useAppIdSelectorEnforce(selectPlayerById, playerId);

  return (
    <Chip
      key={player.name}
      avatar={<PersonIcon />}
      label={player.name}
      onDelete={
        // Turn off onDelete to prevent player count from dropping below
        // allowed minimum
        isDeletable ? () => dispatch(playerRemoved(player.name)) : undefined
      }
    />
  );
}

export default function Players({
  playerCount: { min: minPlayerCount, max: maxPlayerCount },
}: {
  playerCount: { min: number; max: number };
}) {
  const [newPlayerName, setNewPlayerName] = useState("");

  const dispatch = useAppDispatch();

  const playerIds = useAppSelector(selectPlayerIds);

  return (
    <section>
      {playerIds.map((playerId) => (
        <Player playerId={playerId} isDeletable={playerIds.length > 2} />
      ))}
      {playerIds.length < maxPlayerCount && (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            dispatch(playerAdded({ name: newPlayerName }));
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
