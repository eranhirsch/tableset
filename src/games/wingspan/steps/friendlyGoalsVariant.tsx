import { createVariant } from "games/core/steps/createVariant";

export default createVariant({
  id: "friendlyGoals",
  name: "Friendly Goals",
  dependencies: [],
  isTemplatable: () => true,
  Description:
    "For a game with less direct competition between players. This is good for new players.",
});
