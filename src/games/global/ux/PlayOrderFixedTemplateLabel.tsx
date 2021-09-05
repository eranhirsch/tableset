import { useAppSelector } from "../../../app/hooks";
import first_name from "../../../common/first_name";
import {
  PlayerId,
  playersSelectors,
} from "../../../features/players/playersSlice";

export default function PlayOrderFixedTemplateLabel({
  value,
}: {
  value: readonly PlayerId[];
}): JSX.Element | null {
  const firstPlayerId = useAppSelector(
    (state) => playersSelectors.selectIds(state)[0]
  ) as PlayerId;
  const players = useAppSelector(playersSelectors.selectEntities);

  return (
    <>
      {[firstPlayerId]
        .concat(value)
        .map((playerId) => first_name(players[playerId]!.name))
        .join(" > ")}
    </>
  );
}
