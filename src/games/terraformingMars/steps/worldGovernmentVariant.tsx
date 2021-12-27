import { createVariant } from "games/core/steps/createVariant";
import venusVariant from "./venusVariant";

export default createVariant({
  id: "worldGovernment",
  name: "World Government Terraforming",
  dependencies: [venusVariant],
  isTemplatable: (isVenus) => isVenus.canResolveTo(true),
  Description:
    // Copied verbatim from the manual
    "In order to terraform Venus without slowing down the terraforming of Mars, the WG has decided to help out",
});
