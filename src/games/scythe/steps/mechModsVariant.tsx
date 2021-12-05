import { createVariant } from "games/core/steps/createVariant";
import productsMetaStep from "./productsMetaStep";

export default createVariant({
  id: "mechMods",
  name: "Mech Mods",
  dependencies: [productsMetaStep],
  isTemplatable: (products) => products.willContain("fenris")!,
  Description: "Use Mech Mods if you want to add more variety to each faction.",
});

// After determining your faction and player mats, draw 4 Mech Mods at random (redraw duplicates) and place up to 2 of them on your faction mat. Discard all Mech Mods you neither choose nor place.
