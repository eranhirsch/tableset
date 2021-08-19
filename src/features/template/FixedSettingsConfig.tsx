import { SetupStepName } from "../../games/concordia/ConcordiaGame";
import ItemsListPanel from "./panels/ItemsListPanel";
import PlayerColorPanel from "./panels/PlayerColorPanel";
import PlayerOrderPanel from "./panels/PlayerOrderPanel";
import StartingPlayerPanel from "./panels/StartingPlayerPanel";

export default function FixedSettingsConfig({
  stepId,
}: {
  stepId: SetupStepName;
}) {
  switch (stepId) {
    case "playOrder":
      return <PlayerOrderPanel />;
    case "playerColors":
      return <PlayerColorPanel />;
    case "firstPlayer":
      return <StartingPlayerPanel />;

    default:
      return <ItemsListPanel stepId={stepId} />;
  }
}
