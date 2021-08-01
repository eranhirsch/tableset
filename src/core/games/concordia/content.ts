import { SetupStepName } from "./SetupStep";

export function stepLabel(stepName: SetupStepName): string {
  switch (stepName) {
    case "map":
      return "Map";
    case "cityTiles":
      return "City Resource";
    case "bonusTiles":
      return "Province Bonus";
    case "initialMarket":
      return "Cards Market";
    case "marketDeck":
      return "Market Deck";
    case "startingPlayer":
      return "First Player";
    case "playOrder":
      return "Seating";
    case "playerColor":
      return "Player Color";
  }
}
