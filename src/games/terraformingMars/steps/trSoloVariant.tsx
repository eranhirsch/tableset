import { createVariant } from "games/core/steps/createVariant";
import { playersMetaStep } from "games/global";

export const TR_GOAL = 63;

export default createVariant({
  id: "trSolo",
  name: "Solo: TR",
  dependencies: [playersMetaStep],
  isTemplatable: (players) => players.onlyResolvableValue()!.length === 1,
  Description: `Your goal is no longer to complete the global parameters, but to reach a Terraform Rating of ${TR_GOAL}`,
});
