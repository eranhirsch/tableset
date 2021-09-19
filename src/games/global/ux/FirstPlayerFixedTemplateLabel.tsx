import { PlayerId } from "../../../features/players/playersSlice";
import { PlayerShortName } from "./PlayerShortName";

export default function FirstPlayerFixedTemplateLabel({
  value,
}: {
  value: PlayerId;
}): JSX.Element {
  return <PlayerShortName playerId={value} />;
}
