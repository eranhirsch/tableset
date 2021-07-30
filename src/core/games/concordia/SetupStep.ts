import { SetupStep, Strategy } from "../../../features/template/templateSlice";

export type SetupStepName = "map" | "cityTiles";

export function availableStrategies(
  setupStepName: SetupStepName,
  template: SetupStep<SetupStepName>[]
): Strategy[] {
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
      const mapTemplate = template.find((step) => step.name === "map");
      if (mapTemplate != null && mapTemplate.strategy === Strategy.OFF) {
        return [Strategy.OFF];
      }

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
