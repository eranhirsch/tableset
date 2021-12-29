import { createVariant } from "games/core/steps/createVariant";
import productsMetaStep from "./productsMetaStep";

export default createVariant({
  id: "prelude",
  name: "Prelude",
  dependencies: [productsMetaStep],
  isTemplatable: (products) => products.willContain("prelude")!,
  Description:
    // Copied from the product description on BGG
    "You choose from Prelude cards that jumpstart the terraforming process or boost your corporation's engine",
});
