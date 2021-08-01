import {
  SetupStep,
  Strategy,
  TemplateState,
} from "../../../features/template/templateSlice";

export type SetupStepName = "map" | "cityTiles" | "bonusTiles";

export const initialTemplate: TemplateState = [
  { name: "map", strategy: Strategy.OFF },
  { name: "cityTiles", strategy: Strategy.OFF },
  { name: "bonusTiles", strategy: Strategy.OFF },
];

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

    case "bonusTiles":
      const cityTilesTemplate = template.find(
        (step) => step.name === "cityTiles"
      );
      if (
        cityTilesTemplate != null &&
        cityTilesTemplate.strategy !== Strategy.OFF
      ) {
        return [Strategy.COMPUTED];
      }

      return [Strategy.OFF];
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
