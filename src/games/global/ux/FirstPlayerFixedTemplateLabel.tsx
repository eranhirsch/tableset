import { useAppEntityIdSelectorEnforce } from "../../../common/hooks/useAppEntityIdSelector";
import {
  PlayerId,
  playersSelectors,
} from "../../../features/players/playersSlice";

export default function FirstPlayerFixedTemplateLabel({
  value,
}: {
  value: PlayerId;
}): JSX.Element {
  const player = useAppEntityIdSelectorEnforce(playersSelectors, value);
  return <>{player.name}</>;
}
