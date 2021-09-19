import { Chip } from "@material-ui/core";
import { useAppDispatch } from "../../app/hooks";
import PersonIcon from "@material-ui/icons/Person";
import playersSlice, { playersSelectors } from "./playersSlice";
import { EntityId } from "@reduxjs/toolkit";
import { useAppEntityIdSelectorEnforce } from "../../common/hooks/useAppEntityIdSelector";

export default function PlayerChip({
  playerId,
}: {
  playerId: EntityId;
}): JSX.Element | null {
  const dispatch = useAppDispatch();

  const player = useAppEntityIdSelectorEnforce(playersSelectors, playerId);

  return (
    <Chip
      key={player.id}
      avatar={<PersonIcon />}
      label={player.name}
      onDelete={() => dispatch(playersSlice.actions.removed(player.id))}
    />
  );
}
