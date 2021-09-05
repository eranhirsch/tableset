import { useAppSelector } from "../../../app/hooks";
import first_name from "../../../common/first_name";
import PlayerColors from "../../../common/PlayerColors";
import { playersSelectors } from "../../../features/players/playersSlice";

export default function PlayersColorsFixedTemplateLabel({
  value,
}: {
  value: PlayerColors;
}): JSX.Element | null {
  const players = useAppSelector(playersSelectors.selectEntities);
  return (
    <>
      {Object.entries(value)
        .map(
          ([playerId, color]) =>
            `${first_name(players[playerId]!.name)}: ${color}`
        )
        .join(", ")}
    </>
  );
}
