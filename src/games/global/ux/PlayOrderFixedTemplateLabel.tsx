import { useAppSelector } from "../../../app/hooks";
import first_name from "../../../common/first_name";
import { PlayerId, selectors } from "../../../features/players/playersSlice";

export default function PlayOrderFixedTemplateLabel({
  value,
}: {
  value: readonly PlayerId[];
}) {
  const firstPlayerId = useAppSelector(
    (state) => selectors.selectIds(state)[0]
  ) as PlayerId;
  const players = useAppSelector(selectors.selectEntities);

  return (
    <>
      {[firstPlayerId]
        .concat(value)
        .map((playerId) => first_name(players[playerId]!.name))
        .join(" > ")}
    </>
  );
}
