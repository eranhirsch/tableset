import { createVariant } from "games/core/steps/createVariant";
import swiftStartVariant from "./swiftStartVariant";

export default createVariant({
  id: "friendlyGoals",
  name: "Friendly Goals",
  dependencies: [],
  isTemplatable: () => true,
  incompatibleWith: swiftStartVariant,
  Description:
    "For a game with less direct competition between players. This is good for new players.",
});
