import { createVariant } from "games/core/steps/createVariant";
import productsMetaStep from "./productsMetaStep";

export default createVariant({
  id: "venus",
  name: "Venus Next",
  dependencies: [productsMetaStep],
  isTemplatable: (products) => products.willContain("venus")!,
  Description:
    // Copied from the description at the product page in BGG
    "The World Government chooses to also fund the terraforming of Venus. Around 50 project cards and 5 corporations are added, with a special focus on how to make Venus habitable. With the new floater resource, a new milestone, a new award, a new tag, and a new terraforming parameter, players are given more paths to victory and an even more varied play.",
});
