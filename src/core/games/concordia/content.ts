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
    case "playOrder":
      return "Play Order";
    case "playerColor":
      return "Player Color";
  }
}
