import { Avatar } from "@material-ui/core";
import { useAppEntityIdSelectorEnforce } from "../../../common/hooks/useAppEntityIdSelector";
import short_name from "../../../common/short_name";
import {
  PlayerId,
  playersSelectors,
} from "../../../features/players/playersSlice";

export default function Player({
  playerId,
  inline = false,
}: {
  playerId: PlayerId;
  inline?: boolean;
}): JSX.Element | null {
  const player = useAppEntityIdSelectorEnforce(playersSelectors, playerId);
  return (
    <Avatar {...(inline ? { sx: { display: "inline-flex" } } : {})}>
      {short_name(player.name)}
    </Avatar>
  );
}
