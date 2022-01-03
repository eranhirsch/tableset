import { createTeamSelectionStep } from "games/global";
import teamVariant from "./teamVariant";

export default createTeamSelectionStep({
  teamSize: 2,
  enablerStep: teamVariant,
});
