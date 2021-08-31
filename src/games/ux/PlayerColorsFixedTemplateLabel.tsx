import { useAppSelector } from "../../app/hooks";
import first_name from "../../common/first_name";
import PlayerColors from "../../common/PlayerColors";
import { selectors } from "../../features/players/playersSlice";

export default function PlayersColorsFixedTemplateLabel({
  value,
}: {
  value: PlayerColors;
}) {
  const players = useAppSelector(selectors.selectEntities);
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
