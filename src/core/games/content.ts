import { SetupStepName } from "./concordia/SetupStep";

export function stepLabel(stepName: SetupStepName): string {
  switch (stepName) {
    case "map":
      return "Map";
    case "cityTiles":
      return "City Resource";
    case "bonusTiles":
      return "Province Bonus";
  }
}
