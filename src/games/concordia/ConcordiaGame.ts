import { Dictionary } from "@reduxjs/toolkit";
import invariant_violation from "../../common/err/invariant_violation";
import { TemplateElement } from "../../features/template/templateSlice";
import { Strategy } from "../../core/Strategy";
import { GamePiecesColor } from "../../core/themeWithGameColors";
import invariant from "../../common/err/invariant";

export type SetupStepName =
  | "bank"
  | "bonusTiles"
  | "cityTiles"
  | "concordiaCard"
  | "firstPlayer"
  | "map"
  | "marketCards"
  | "marketDeck"
  | "marketDisplay"
  | "playerColors"
  | "playerPieces"
  | "playOrder"
  | "praefectusMagnus"
  | "resourcePiles"
  | "startingColonists"
  | "startingMoney";

export default class ConcordiaGame {
  public static get order(): SetupStepName[] {
    return [
      "map",
      "cityTiles",
      "bonusTiles",
      "marketCards",
      "marketDisplay",
      "marketDeck",
      "concordiaCard",
      "resourcePiles",
      "bank",
      "playOrder",
      "playerColors",
      "playerPieces",
      "startingColonists",
      "firstPlayer",
      "startingMoney",
      "praefectusMagnus",
    ];
  }

  public static resolve(
    stepId: SetupStepName,
    strategy: Strategy,
    playersTotal: number
  ): string {
    invariant(
      strategy !== Strategy.FIXED,
      `Failed to copy the constant value directly to the instance for step '${stepId}'`
    );

    switch (stepId) {
      case "map":
        switch (strategy) {
          case Strategy.RANDOM:
            const items = this.itemsForStep(stepId);
            return items[Math.floor(Math.random() * items.length)];
          case Strategy.DEFAULT:
            return playersTotal < 4 ? "Italia" : "Imperium";
        }
    }

    invariant_violation(
      `Step ${stepId} could not be resolved with strategy ${strategy}`
    );
  }

  public static strategiesFor(
    stepId: SetupStepName,
    template: Dictionary<TemplateElement<SetupStepName>>,
    playersTotal: number
  ): Strategy[] {
    switch (stepId) {
      case "map":
        return [
          Strategy.OFF,
          Strategy.DEFAULT,
          Strategy.RANDOM,
          Strategy.ASK,
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

      case "marketDisplay":
        return [Strategy.OFF, Strategy.RANDOM];

      case "playOrder":
        if (playersTotal < 3) {
          return [Strategy.OFF];
        }
        return [Strategy.OFF, Strategy.RANDOM, Strategy.ASK, Strategy.FIXED];

      case "playerColors":
        return [Strategy.OFF, Strategy.RANDOM, Strategy.ASK, Strategy.FIXED];

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

      case "firstPlayer":
        return [Strategy.OFF, Strategy.RANDOM, Strategy.ASK, Strategy.FIXED];

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
