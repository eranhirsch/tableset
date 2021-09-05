import { Avatar } from "@material-ui/core";
import { useAppEntityIdSelectorEnforce } from "../../../common/hooks/useAppEntityIdSelector";
import short_name from "../../../common/short_name";
import {
  PlayerId,
  playersSelectors,
} from "../../../features/players/playersSlice";

export default function Player({
  playerId,
}: {
  playerId: PlayerId;
}): JSX.Element | null {
  const player = useAppEntityIdSelectorEnforce(playersSelectors, playerId);
  return <Avatar>{short_name(player.name)}</Avatar>;
}
