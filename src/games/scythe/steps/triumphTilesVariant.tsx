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
    // Taken from the manual, page 37
    "Triumph Tiles create a fully randomized, customizable version of the Triumph Track",
});
