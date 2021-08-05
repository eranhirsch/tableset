import { Dictionary } from "@reduxjs/toolkit";
import { SetupStep } from "../../../features/template/templateSlice";
import { Strategy } from "../../Strategy";

export type SetupStepName =
  | "map"
  | "cityTiles"
  | "bonusTiles"
  | "initialMarket"
  | "marketDeck"
  | "startingPlayer"
  | "playOrder"
  | "playerColor";

export const initialTemplate: SetupStep<SetupStepName>[] = [
  { name: "map", strategy: Strategy.OFF },
  { name: "cityTiles", strategy: Strategy.OFF },
  { name: "bonusTiles", strategy: Strategy.OFF },
  { name: "initialMarket", strategy: Strategy.OFF },
  { name: "marketDeck", strategy: Strategy.OFF },
  { name: "startingPlayer", strategy: Strategy.OFF },
  { name: "playOrder", strategy: Strategy.OFF },
  { name: "playerColor", strategy: Strategy.OFF },
];

export function availableStrategies(
  stepId: SetupStepName,
  template: Dictionary<SetupStep<SetupStepName>>
): Strategy[] {
  switch (stepId) {
    case "map":
      return [
        Strategy.OFF,
        Strategy.DEFAULT,
        Strategy.RANDOM,
        Strategy.MANUAL,
        Strategy.FIXED,
      ];

    case "cityTiles":
      const { map: mapStep } = template;
      if (mapStep != null && mapStep.strategy === Strategy.OFF) {
        return [Strategy.OFF];
      }

      return [Strategy.OFF, Strategy.RANDOM];

    case "bonusTiles":
      const { cityTiles: cityTilesStep } = template;
      if (cityTilesStep != null && cityTilesStep.strategy !== Strategy.OFF) {
        return [Strategy.COMPUTED];
      }

      return [Strategy.OFF];

    case "initialMarket":
      return [Strategy.OFF, Strategy.RANDOM];

    case "marketDeck":
      return [Strategy.OFF];

    case "startingPlayer":
      return [Strategy.OFF, Strategy.RANDOM, Strategy.MANUAL, Strategy.FIXED];

    case "playOrder":
      return [Strategy.OFF, Strategy.RANDOM, Strategy.MANUAL, Strategy.FIXED];

    case "playerColor":
      return [Strategy.OFF, Strategy.RANDOM];
  }
}

export function availableItems(step: SetupStepName): string[] | null {
  switch (step) {
    case "map":
      return ["Italia", "Imperium"];
    default:
      return null;
  }
}
