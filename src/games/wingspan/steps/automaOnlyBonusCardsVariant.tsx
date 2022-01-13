import { createVariant } from "games/core/steps/createVariant";
import { playersMetaStep } from "games/global";
import productsMetaStep from "./productsMetaStep";

export default createVariant({
  id: "automaOnlyBonusCards",
  name: "Solo: Automa-only Bonus Cards",
  dependencies: [playersMetaStep, productsMetaStep],
  isTemplatable: (players, products) =>
    players.onlyResolvableValue()!.length === 1 &&
    products.willContain("europe")!,
  Description:
    "2 Automa-only cards that could be used instead of a random regular one.",
});
