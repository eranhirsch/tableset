import { Dictionary } from "@reduxjs/toolkit";
import invariant_violation from "../../../common/err/invariant_violation";
import { SetupStep } from "../../../features/template/templateSlice";
import { Strategy } from "../../Strategy";
import { GamePiecesColor } from "../../themeWithGameColors";

export type SetupStepName =
  | "map"
  | "cityTiles"
  | "bonusTiles"
  | "initialMarket"
  | "marketDeck"
  | "playOrder"
  | "playerColor"
  | "playerPieces"
  | "startingMoney"
  | "praefectusMagnus"
  | "concordiaCard"
  | "gatherMarketCards"
  | "startingColonists"
  | "resourcePiles"
  | "bank";

export default class ConcordiaGame {
  public static get order(): SetupStepName[] {
    return [
      "map",
      "cityTiles",
      "bonusTiles",
      "gatherMarketCards",
      "initialMarket",
      "marketDeck",
      "concordiaCard",
      "resourcePiles",
      "bank",
      "playOrder",
      "playerColor",
      "playerPieces",
      "startingColonists",
      "startingMoney",
      "praefectusMagnus",
    ];
  }

  public static strategiesFor(
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

      case "cityTiles": {
        const { map } = template;
        if (map == null || map.strategy === Strategy.OFF) {
          return [Strategy.OFF];
        }
        return [Strategy.OFF, Strategy.RANDOM];
      }

      case "bonusTiles": {
        const { cityTiles } = template;
        if (cityTiles != null && cityTiles.strategy !== Strategy.OFF) {
          return [Strategy.COMPUTED];
        }
        return [Strategy.OFF];
      }

      case "initialMarket":
        return [Strategy.OFF, Strategy.RANDOM];

      case "playOrder":
        return [Strategy.OFF, Strategy.RANDOM, Strategy.MANUAL, Strategy.FIXED];

      case "playerColor":
        return [Strategy.OFF, Strategy.RANDOM, Strategy.MANUAL, Strategy.FIXED];

      case "startingMoney": {
        const { playOrder } = template;
        if (playOrder != null && playOrder.strategy !== Strategy.OFF) {
          return [Strategy.COMPUTED];
        }
        return [Strategy.OFF];
      }

      case "praefectusMagnus": {
        const { playOrder } = template;
        if (playOrder != null && playOrder.strategy !== Strategy.OFF) {
          return [Strategy.COMPUTED];
        }
        return [Strategy.OFF];
      }

      case "startingColonists": {
        const { map } = template;
        if (map != null && map.strategy !== Strategy.OFF) {
          return [Strategy.COMPUTED];
        }
        return [Strategy.OFF];
      }

      default:
        return [Strategy.OFF];
    }
  }

  public static get playerColors(): GamePiecesColor[] {
    return ["black", "blue", "green", "red", "yellow"];
  }

  public static itemsForStep(stepId: SetupStepName): string[] {
    switch (stepId) {
      case "map":
        return ["Italia", "Imperium"];

      default:
        invariant_violation(
          `No items for step ${stepId}, the step shouldn't have FIXED strategy enabled for it`
        );
    }
  }
}
