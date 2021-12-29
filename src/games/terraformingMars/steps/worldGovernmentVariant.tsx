import { createVariant } from "games/core/steps/createVariant";
import { playersMetaStep } from "games/global";
import venusVariant from "./venusVariant";

export default createVariant({
  id: "worldGovernment",
  name: "World Government Terraforming",
  dependencies: [playersMetaStep, venusVariant],
  isTemplatable: (players, isVenus) =>
    players.onlyResolvableValue()!.length > 1 && isVenus.canResolveTo(true),
  Description:
    // Copied verbatim from the manual
    "In order to terraform Venus without slowing down the terraforming of Mars, the WG has decided to help out",
});
