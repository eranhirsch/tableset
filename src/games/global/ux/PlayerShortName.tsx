import { useAppSelector } from "../../../app/hooks";
import { useAppEntityIdSelectorEnforce } from "../../../common";
import { shortest_unique_name } from "../../../common/shortest_names";
import { PlayerId } from "../../../model/Player";
import {
  playersSelectors,
  allPlayerNamesSelector,
} from "../../../features/players/playersSlice";

export function PlayerShortName({
  playerId,
}: {
  playerId: PlayerId;
}): JSX.Element {
  const player = useAppEntityIdSelectorEnforce(playersSelectors, playerId);
  const allNames = useAppSelector(allPlayerNamesSelector);
  return <>{shortest_unique_name(player.name, allNames)}</>;
}
