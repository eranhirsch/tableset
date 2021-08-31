import { useAppEntityIdSelectorEnforce } from "../../common/hooks/useAppEntityIdSelector";
import { PlayerId, selectors } from "../../features/players/playersSlice";

export default function FirstPlayerFixedTemplateLabel({
  value,
}: {
  value: PlayerId;
}) {
  const player = useAppEntityIdSelectorEnforce(selectors, value);
  return <>{player.name}</>;
}
