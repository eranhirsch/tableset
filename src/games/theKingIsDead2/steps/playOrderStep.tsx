import { createPlayOrderStep } from "games/global";
import teamsStep from "./teamsStep";

export default createPlayOrderStep({
  teamSelectionStep: teamsStep,
});
