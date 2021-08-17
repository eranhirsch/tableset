import { SetupStepName } from "./ConcordiaGame";

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
    case "playerPieces":
      return "Player Pieces";
    case "startingMoney":
      return "Starting Money";
    case "praefectusMagnus":
      return "Præfectus Magnus";
    case "concordiaCard":
      return "Concordia Card";
  }
}
