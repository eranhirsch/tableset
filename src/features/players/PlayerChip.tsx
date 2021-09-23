import PersonIcon from "@mui/icons-material/Person";
import { Chip } from "@mui/material";
import { EntityId } from "@reduxjs/toolkit";
import { useAppDispatch } from "../../app/hooks";
import { ReactUtils } from "common";
import { playersActions, playersSelectors } from "./playersSlice";

export default function PlayerChip({
  playerId,
}: {
  playerId: EntityId;
}): JSX.Element | null {
  const dispatch = useAppDispatch();

  const player = ReactUtils.useAppEntityIdSelectorEnforce(
    playersSelectors,
    playerId
  );

  return (
    <Chip
      key={player.id}
      avatar={<PersonIcon />}
      label={player.name}
      onDelete={() => dispatch(playersActions.removed(player.id))}
    />
  );
}
