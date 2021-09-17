import { Avatar } from "@material-ui/core";
import { useAppEntityIdSelectorEnforce } from "../../../common/hooks/useAppEntityIdSelector";
import { shortest_unique_abbreviation } from "../../../common/shortest_names";
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
    <Avatar
      {...(inline ? { component: "span", sx: { display: "inline-flex" } } : {})}
    >
      {shortest_unique_abbreviation(
        player.name,
        // TODO: Send the other player names to get real shortest name
        [player.name]
      )}
    </Avatar>
  );
}
