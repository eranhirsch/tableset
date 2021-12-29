import { createVariant } from "games/core/steps/createVariant";
import productsMetaStep from "./productsMetaStep";

export default createVariant({
  id: "colonies",
  name: "Colonies",
  dependencies: [productsMetaStep],
  isTemplatable: (products) => products.willContain("colonies")!,
  Description:
    // Copied verbatim from the manual
    "you have the opportunity to visit several moons, represented by Colony Tiles, where you can build colonies, or trade to get the specific benefits from them",
});
