import { Avatar } from "@material-ui/core";
import { useAppSelector } from "../../../app/hooks";
import { useAppEntityIdSelectorEnforce } from "../../../common/hooks/useAppEntityIdSelector";
import { shortest_unique_abbreviation } from "../../../common/shortest_names";
import {
  allPlayerNamesSelector,
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
  const allNames = useAppSelector(allPlayerNamesSelector);

  return (
    <Avatar
      {...(inline ? { component: "span", sx: { display: "inline-flex" } } : {})}
    >
      {shortest_unique_abbreviation(player.name, allNames)}
    </Avatar>
  );
}
