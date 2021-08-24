import { Chip } from "@material-ui/core";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import PersonIcon from "@material-ui/icons/Person";
import playersSlice, { selectors as playersSelectors } from "./playersSlice";
import { EntityId } from "@reduxjs/toolkit";
import { useAppEntityIdSelectorEnforce } from "../../common/hooks/useAppEntityIdSelector";

export default function Player({ playerId }: { playerId: EntityId }) {
  const dispatch = useAppDispatch();

  const player = useAppEntityIdSelectorEnforce(playersSelectors, playerId);
  const playersTotal = useAppSelector(playersSelectors.selectTotal);

  return (
    <Chip
      key={player.id}
      avatar={<PersonIcon />}
      label={player.name}
      onDelete={() =>
        dispatch(playersSlice.actions.removed(player.id, playersTotal))
      }
    />
  );
}
