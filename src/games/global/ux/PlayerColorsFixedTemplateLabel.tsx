import { useAppSelector } from "../../../app/hooks";
import PlayerColors from "../../../common/PlayerColors";
import { shortest_unique_name } from "../../../common/shortest_names";
import { playersSelectors } from "../../../features/players/playersSlice";

export default function PlayersColorsFixedTemplateLabel({
  value,
}: {
  value: PlayerColors;
}): JSX.Element {
  const players = useAppSelector(playersSelectors.selectEntities);
  return (
    <>
      {Object.entries(value)
        .map(
          ([playerId, color]) =>
            `${shortest_unique_name(
              players[playerId]!.name,
              // TODO: Send the other player names to get real shortest name
              [players[playerId]!.name]
            )}: ${color}`
        )
        .join(", ")}
    </>
  );
}
