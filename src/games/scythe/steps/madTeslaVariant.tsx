import { createVariant } from "games/core/steps/createVariant";
import productsMetaStep from "./productsMetaStep";
import teslaVariant from "./teslaVariant";

export default createVariant({
  id: "madTesla",
  name: "Mad Tesla",
  dependencies: [productsMetaStep],
  isTemplatable: (products) => products.willContain("fenris")!,
  incompatibleWith: teslaVariant,
  Description:
    "Use the Mad Tesla module if you’re looking for an NPC to fight instead of (or in addition to) other players.",
});
