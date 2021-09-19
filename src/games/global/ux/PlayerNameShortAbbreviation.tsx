import { useAppSelector } from "../../../app/hooks";
import { useAppEntityIdSelectorEnforce } from "../../../common/hooks/useAppEntityIdSelector";
import { shortest_unique_abbreviation } from "../../../common/shortest_names";
import { PlayerId } from "../../../core/model/Player";
import {
  allPlayerNamesSelector,
  playersSelectors,
} from "../../../features/players/playersSlice";

export function PlayerNameShortAbbreviation({
  playerId,
}: {
  playerId: PlayerId;
}): JSX.Element {
  const player = useAppEntityIdSelectorEnforce(playersSelectors, playerId);
  const allNames = useAppSelector(allPlayerNamesSelector);
  return <>{shortest_unique_abbreviation(player.name, allNames)}</>;
}
