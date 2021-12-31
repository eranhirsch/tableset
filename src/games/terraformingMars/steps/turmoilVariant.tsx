import { createVariant } from "games/core/steps/createVariant";
import productsMetaStep from "./productsMetaStep";

export default createVariant({
  id: "turmoil",
  name: "Turmoil",
  dependencies: [productsMetaStep],
  isTemplatable: (products) => products.willContain("turmoil")!,
  Description:
    // Copied verbatim from the manual
    "Introduces Global Events that affect all players. The players also place delegates in the Terraforming Committee to gain influence and decide which party will rule during the next generation.d",
});
