import { useAppSelector } from "app/hooks";
import { ReactUtils } from "common";
import { PlayerId } from "model/Player";
import { allPlayerNamesSelector, allPlayersSelectors } from "./playersSlice";
import { shortest_unique_abbreviation } from "./shortest_names";

export function PlayerNameShortAbbreviation({
  playerId,
}: {
  playerId: PlayerId;
}): JSX.Element {
  const player = ReactUtils.useAppEntityIdSelectorEnforce(
    allPlayersSelectors,
    playerId
  );
  const allNames = useAppSelector(allPlayerNamesSelector);
  return <>{shortest_unique_abbreviation(player.name, allNames)}</>;
}
