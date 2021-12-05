import { createVariant } from "games/core/steps/createVariant";
import productsMetaStep from "./productsMetaStep";
import warAndPeaceVariant from "./warAndPeaceVariant";

export default createVariant({
  id: "triumphTiles",
  name: "Triumph Tiles",
  dependencies: [productsMetaStep],
  isTemplatable: (products) => products.willContain("fenris")!,
  incompatibleWith: warAndPeaceVariant,
  Description:
    "Use the Triumph Tiles when you want some variability in how to achieve stars.",
});
