import invariant_violation from "../../common/err/invariant_violation";
import { StepId } from "../Game";

export function stepLabel(id: StepId): string {
  switch (id) {
    case "map":
      return "Map";
    case "cityTiles":
      return "City Resources";
    case "bonusTiles":
      return "Province Bonus";
    case "marketDisplay":
      return "Initial Market";
    case "marketDeck":
      return "Market Deck";
    case "playOrder":
      return "Seating";
    case "playerColors":
      return "Player Color";
    case "playerPieces":
      return "Player Pieces";
    case "startingMoney":
      return "Starting Money";
    case "praefectusMagnus":
      return "Præfectus Magnus";
    case "concordiaCard":
      return "Concordia Card";
    case "marketCards":
      return "Market Cards";
    case "startingColonists":
      return "Starting Colonists";
    case "resourcePiles":
      return "Resource Piles";
    case "bank":
      return "Bank";
    case "firstPlayer":
      return "Starting Player";
    case "startingResources":
      return "Starting Resources";
  }

  invariant_violation(
    `For the game Concordia, we don't have a label for the step id '${id}'`
  );
}
