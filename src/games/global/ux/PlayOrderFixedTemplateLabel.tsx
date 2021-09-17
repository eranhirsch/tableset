import { useAppSelector } from "../../../app/hooks";
import { shortest_unique_name } from "../../../common/shortest_names";
import {
  allPlayerNamesSelector,
  PlayerId,
  playersSelectors,
} from "../../../features/players/playersSlice";

export default function PlayOrderFixedTemplateLabel({
  value,
}: {
  value: readonly PlayerId[];
}): JSX.Element {
  const firstPlayerId = useAppSelector(
    (state) => playersSelectors.selectIds(state)[0]
  ) as PlayerId;
  const players = useAppSelector(playersSelectors.selectEntities);
  const allNames = useAppSelector(allPlayerNamesSelector);

  return (
    <>
      {[firstPlayerId]
        .concat(value)
        .map((playerId) =>
          shortest_unique_name(players[playerId]!.name, allNames)
        )
        .join(" > ")}
    </>
  );
}
