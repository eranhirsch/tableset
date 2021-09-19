import { useAppSelector } from "../../../app/hooks";
import {
  firstPlayerIdSelector,
  PlayerId,
} from "../../../features/players/playersSlice";
import { PlayerShortName } from "./PlayerShortName";

export default function PlayOrderFixedTemplateLabel({
  value,
}: {
  value: readonly PlayerId[];
}): JSX.Element {
  const firstPlayerId = useAppSelector(firstPlayerIdSelector);
  return (
    <>
      {[firstPlayerId]
        .concat(value)
        .map((playerId) => <PlayerShortName playerId={playerId} />)
        .join(" > ")}
    </>
  );
}
