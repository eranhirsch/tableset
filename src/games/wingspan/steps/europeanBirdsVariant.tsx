import { createVariant } from "games/core/steps/createVariant";
import productsMetaStep from "./productsMetaStep";

export default createVariant({
  id: "europe",
  name: "European Birds",
  dependencies: [productsMetaStep],
  isTemplatable: (products) => products.willContain("europe")!,
  Description:
    // Copied verbatim from the manual
    "In this first expansion to Wingspan, we increase the scope of the world to include the regal, beautiful, and varied birds of Europe. These birds feature a variety of new powers, including “round end” powers, powers that increase interaction between players, birds that can cover multiple spaces to make future actions more profitable, and birds that benefit from excess cards/food. The European birds are designed to be shuffled into the original deck of cards (and cards from future expansions).",
});
