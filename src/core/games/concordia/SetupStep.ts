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
