import { Avatar } from "@material-ui/core";
import { EntityId } from "@reduxjs/toolkit";
import { useAppEntityIdSelectorEnforce } from "../../../common/hooks/useAppEntityIdSelector";
import short_name from "../../../common/short_name";
import { selectors } from "../../../features/players/playersSlice";

export function FirstPlayerPanel({ playerId }: { playerId: EntityId }) {
  const player = useAppEntityIdSelectorEnforce(selectors, playerId);

  return <Avatar>{short_name(player.name)}</Avatar>;
}
