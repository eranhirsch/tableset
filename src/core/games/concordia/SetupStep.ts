import { Strategy } from "../../../features/template/templateSlice";

export type SetupStepName = "map";

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
  }
}

export function availableItems(step: SetupStepName): string[] {
  switch (step) {
    case "map":
      return ["Italia", "Imperium"];
  }
}

