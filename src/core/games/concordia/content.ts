import invariant_violation from "../../../common/err/invariant_violation";
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

export function colorCssValue(label: string): string {
  switch (label) {
    case "red":
      return "#FF0000";
    case "green":
      return "#00FF00";
    case "blue":
      return "#0000FF";
    case "black":
      return "#000000";
    case "yellow":
      return "#FFFF00";
  }
  invariant_violation(`Unknown color label ${label}`);
}
