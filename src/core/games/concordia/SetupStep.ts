import { Strategy } from "../../../features/template/templateSlice";

export type SetupStepName = "map" | "cityTiles";

export function availableStrategies(setupStepName: SetupStepName): Strategy[] {
  switch (setupStepName) {
    case "map":
      return [
        Strategy.OFF,
        Strategy.DEFAULT,
        Strategy.RANDOM,
        Strategy.MANUAL,
        Strategy.FIXED,
      ];
    case "cityTiles":
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

