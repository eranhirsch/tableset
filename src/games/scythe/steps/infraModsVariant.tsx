import { createVariant } from "games/core/steps/createVariant";
import productsMetaStep from "./productsMetaStep";

export default createVariant({
  id: "infraMods",
  name: "Infra Mods",
  dependencies: [productsMetaStep],
  isTemplatable: (products) => products.willContain("fenris")!,
  Description:
    // Copied from the manual, p. 51 and p. 7
    "These 32 tokens provide once-per-episode abilities that boost your economy. Use Infrastructure Mods if you want to add more flexibility to the constraints presented to you by the player mats.",
});
