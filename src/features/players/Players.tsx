import { Chip, IconButton, TextField } from "@material-ui/core";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import PersonIcon from "@material-ui/icons/Person";
import { useEffect, useState } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import {
  added as playerAdded,
  removed as playerRemoved,
  initialized as playersInitialized,
  selectById as selectPlayerById,
  selectIds as selectPlayerIds,
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

function NewPlayerInput() {
  const dispatch = useAppDispatch();

  const [newPlayerName, setNewPlayerName] = useState("");

  return (
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
  );
}

export default function Players({
  playerCount: { min: minPlayerCount, max: maxPlayerCount },
}: {
  playerCount: { min: number; max: number };
}) {
  const dispatch = useAppDispatch();

  const playerIds = useAppSelector(selectPlayerIds);

  useEffect(() => {
    if (playerIds.length === 0) {
      dispatch(
        playersInitialized([
          { name: "Eran Hirsch" },
          { name: "Amit Cwajghaft" },
          { name: "Adam Maoz" },
        ])
      );
    }
  }, [playerIds, dispatch]);

  return (
    <section>
      {playerIds.map((playerId) => (
        <Player playerId={playerId} isDeletable={playerIds.length > 2} />
      ))}
      {playerIds.length < maxPlayerCount && <NewPlayerInput />}
    </section>
  );
}
