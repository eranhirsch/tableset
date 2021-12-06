import { createVariant } from "games/core/steps/createVariant";
import productsMetaStep from "./productsMetaStep";

export default createVariant({
  id: "mechMods",
  name: "Mech Mods",
  dependencies: [productsMetaStep],
  isTemplatable: (products) => products.willContain("fenris")!,
  Description:
    // Copied from the manual, p. 51 and p. 6
    "These 41 tokens provide variable mech abilities that replace the abilities on your faction mat. Use Mech Mods if you want to add more variety to each faction.",
});
