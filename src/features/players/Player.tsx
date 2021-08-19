import { Chip } from "@material-ui/core";
import { useAppDispatch } from "../../app/hooks";
import PersonIcon from "@material-ui/icons/Person";
import playersSlice, { selectors as playersSelectors } from "./playersSlice";
import { EntityId } from "@reduxjs/toolkit";
import { useAppEntityIdSelectorEnforce } from "../../common/hooks/useAppEntityIdSelector";

export default function Player({
  playerId,
  isDeletable,
}: {
  playerId: EntityId;
  isDeletable: boolean;
}) {
  const dispatch = useAppDispatch();

  const player = useAppEntityIdSelectorEnforce(playersSelectors, playerId);

  return (
    <Chip
      key={player.name}
      avatar={<PersonIcon />}
      label={player.name}
      onDelete={
        // Turn off onDelete to prevent player count from dropping below
        // allowed minimum
        isDeletable
          ? () => dispatch(playersSlice.actions.removed(player.name))
          : undefined
      }
    />
  );
}
