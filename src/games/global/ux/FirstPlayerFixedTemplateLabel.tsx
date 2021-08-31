import { useAppEntityIdSelectorEnforce } from "../../../common/hooks/useAppEntityIdSelector";
import {
  PlayerId,
  playersSelectors,
} from "../../../features/players/playersSlice";

export default function FirstPlayerFixedTemplateLabel({
  value,
}: {
  value: PlayerId;
}) {
  const player = useAppEntityIdSelectorEnforce(playersSelectors, value);
  return <>{player.name}</>;
}
