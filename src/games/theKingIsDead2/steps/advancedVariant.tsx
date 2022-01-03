import { createVariant } from "games/core/steps/createVariant";

export default createVariant({
  id: "advanced",
  name: "Advanced",
  dependencies: [],
  isTemplatable: () => true,
  Description:
    "If all players are familiar with the game and agree, you can choose to play the advanced game.",
});
