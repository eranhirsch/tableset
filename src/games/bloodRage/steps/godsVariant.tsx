import { createVariant } from "games/core/steps/createVariant";
import productsMetaStep from "./productsMetaStep";

export default createVariant({
  id: "gods",
  name: "Gods",
  dependencies: [productsMetaStep],
  isTemplatable: (products) => products.willContain("gods")!,
  Description:
    // Copied from BoardGameGeek product description
    "creates a unique texture to that session. They affect draft choices and influence the flow of the battles. Will you try to benefit from a god's power again and again by moving him where you want and always pillaging his province? Or will you do your best to neutralize him by pillaging around his province? Perhaps you'll want to attempt a hopeless pillage on his province just to move him onto another province where he will hinder another player's plans. They add a whole new layer to the game, without adding hardly any complexity to the rules",
});
