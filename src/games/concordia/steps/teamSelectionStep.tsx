import { createTeamSelectionStep } from "games/global";
import teamPlayVariant from "./teamPlayVariant";

export default createTeamSelectionStep({
  enablerStep: teamPlayVariant,
  teamSize: 2,
});
