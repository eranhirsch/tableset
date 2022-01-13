import { createVariant } from "games/core/steps/createVariant";
import productsMetaStep from "./productsMetaStep";

export default createVariant({
  id: "oceania",
  name: "Oceania Birds",
  dependencies: [productsMetaStep],
  isTemplatable: (products) => products.willContain("oceania")!,
  Description:
    // Copied verbatim from the manual
    "In this second expansion to Wingspan, we feature the colorful and awe-inspiring birds of Oceania. The Oceania bird cards are designed to be shuffled into the bird cards from the base game, with or without other expansions.",
});
