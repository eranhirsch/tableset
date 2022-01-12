import { createVariant } from "games/core/steps/createVariant";
import productsMetaStep from "./productsMetaStep";

export default createVariant({
  id: "automaOnlyBonusCards",
  name: "Solo: Automa-only Bonus Cards",
  dependencies: [productsMetaStep],
  isTemplatable: (productsMetaStep) => productsMetaStep.willContain("europe")!,
  Description:
    "2 Automa-only cards that could be used instead of a random regular one.",
});
