import { createVariant } from "games/core/steps/createVariant";
import productsMetaStep from "./productsMetaStep";

export default createVariant({
  id: "tesla",
  name: "Tesla",
  dependencies: [productsMetaStep],
  isTemplatable: (products) => products.willContain("fenris")!,
  Description:
    "Include Tesla if you want to encourage exploration. Alternately, Tesla can be assigned at the beginning of a game to any faction you consider to be “weaker” than the other factions.",
});
