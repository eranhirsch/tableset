import createPlayerAssignmentStep from "games/global/steps/createPlayerAssignmentStep";
import { Airships } from "../utils/Airships";
import airshipAggressiveStep from "./airshipAggressiveStep";
import productsMetaStep from "./productsMetaStep";

export default createPlayerAssignmentStep({
  itemsStep: airshipAggressiveStep,
  availableForProducts: () => Airships.aggressive,
  productsMetaStep,
  labelForItem: (airshipIdx) => Airships.tiles[airshipIdx],
  categoryName: "Aggressive Airship Ability",
});
