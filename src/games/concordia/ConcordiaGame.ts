import { Dictionary } from "@reduxjs/toolkit";
import invariant_violation from "../../common/err/invariant_violation";
import { TemplateElement } from "../../features/template/templateSlice";
import { Strategy } from "../../core/Strategy";
import { GamePiecesColor } from "../../core/themeWithGameColors";
import invariant from "../../common/err/invariant";
import array_expand from "../../common/lib_utils/array_expand";
import Base64 from "../../common/Base64";

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
  private static readonly CITY_TILES = Object.freeze({
    // Possible combos:
    // A: 7!/2!2! === 1260
    A: array_expand({ bricks: 2, food: 2, tools: 1, wine: 1, cloth: 1 }),
    // B: 8!/2!3! === 3360
    B: array_expand({ bricks: 2, food: 3, tools: 1, wine: 1, cloth: 1 }),
    // C: 10!/3!2!2!2! === 75600
    C: array_expand({ bricks: 3, food: 2, tools: 2, wine: 2, cloth: 1 }),
    // D: 5! === 120
    D: array_expand({ bricks: 1, food: 1, tools: 1, wine: 1, cloth: 1 }),
  });

  private static readonly CITIES = Object.freeze({
    italia: {
      A: [
        "BAVSANVM",
        "AQVILEIA",
        "VERONA",
        "COMVM",
        "SEGVSIO",
        "NICAEA",
        "GENVA",
      ],
      B: [
        "MVTINA",
        "RAVENNA",
        "FLORENTIA",
        "COSA",
        "ALERIA",
        "OLBIA",
        "CASINVM",
        "NEAPOLIS",
      ],
      C: [
        "ANCONA",
        "SPOLETVM",
        "HADRIA",
        "LVCRIA",
        "BRVNDISIVM",
        "POTENTIA",
        "CROTON",
        "MESSANA",
        "SYRACVSAE",
        "PANORMVS",
      ],
    },
    imperium: {
      A: [
        "ISCA D.",
        "LONDONIVM",
        "COLONIA A.",
        "VINDOBONA",
        "SIRMIVM",
        "NAPOCA",
        "TOMIS",
      ],
      B: [
        "LVTETIA",
        "BVRDIGALA",
        "MASSILIA",
        "BRIGANTIVM",
        "OLISIPO",
        "VALENTIA",
        "RVSADIR",
        "CARTHAGO",
      ],
      C: [
        "LEPTIS MAGNA",
        "CYRENE",
        "BYCANTIVM",
        "SINOPE",
        "ATTALIA",
        "ANTIOCHIA",
        "TYROS",
        "ALEXANDRIA",
        "MEMPHIS",
        "PETRA",
      ],
      D: ["NOVARIA", "AQVILEIA", "SYRACVSAE", "DIRRHACHIVM", "ATHENAE"],
    },
  });

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
        break;

      case "cityTiles":
        switch (strategy) {
          case Strategy.RANDOM:
            console.log(
              Base64.encode(0),
              Base64.encode(1260 - 1),
              Base64.encode(3360 - 1),
              Base64.encode(75600 - 1),
              Base64.encode(120 - 1),
              Base64.encode(5040 - 1),
              Base64.encode(40320 - 1),
              Base64.encode(3628800 - 1)
            );
            return "";
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
