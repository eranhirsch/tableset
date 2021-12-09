import { createVariant } from "games/core/steps/createVariant";
import productsMetaStep from "./productsMetaStep";

export default createVariant({
  id: "mystics",
  name: "Mystics",
  dependencies: [productsMetaStep],
  isTemplatable: (products) => products.willContain("mystics")!,
  Description:
    // Copied from the product page on BoardGameGeek
    "Mystics are special units (neither Warrior nor Monster) that players can only employ once they've given their clan one of the Mystic Clan Upgrades. ",
});
