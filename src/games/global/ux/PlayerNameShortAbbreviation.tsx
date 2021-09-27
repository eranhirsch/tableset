import { useAppSelector } from "../../../app/hooks";
import { ReactUtils } from "common";
import { shortest_unique_abbreviation } from "../../../features/players/shortest_names";
import { PlayerId } from "../../../model/Player";
import {
  allPlayerNamesSelector,
  playersSelectors,
} from "../../../features/players/playersSlice";

export function PlayerNameShortAbbreviation({
  playerId,
}: {
  playerId: PlayerId;
}): JSX.Element {
  const player = ReactUtils.useAppEntityIdSelectorEnforce(
    playersSelectors,
    playerId
  );
  const allNames = useAppSelector(allPlayerNamesSelector);
  return <>{shortest_unique_abbreviation(player.name, allNames)}</>;
}
