import { Dictionary } from "@reduxjs/toolkit";
import invariant_violation from "../../common/err/invariant_violation";
import { TemplateElement } from "../../features/template/templateSlice";
import { Strategy } from "../../core/Strategy";
import { GamePiecesColor } from "../../core/themeWithGameColors";
import invariant from "../../common/err/invariant";
import { SetupStep } from "../../features/instance/instanceSlice";
import PermutationsLazyArray from "../../common/PermutationsLazyArray";
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

type MapZone = "A" | "B" | "C" | "D";
type Resource = "bricks" | "food" | "tools" | "wine" | "cloth";

export default class ConcordiaGame {
  private static readonly CITY_TILES: Readonly<
    Record<MapZone, Readonly<Record<Resource, number>>>
  > = {
    A: { bricks: 2, food: 2, tools: 1, wine: 1, cloth: 1 },
    B: { bricks: 2, food: 3, tools: 1, wine: 1, cloth: 1 },
    C: { bricks: 3, food: 2, tools: 2, wine: 2, cloth: 1 },
    D: { bricks: 1, food: 1, tools: 1, wine: 1, cloth: 1 },
  };

  private static readonly CITIES: Readonly<{
    [mapId: string]: Readonly<Partial<Record<MapZone, string[]>>>;
  }> = {
    Italia: {
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
    Imperium: {
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
  };

  private static readonly MARKET_DECK_PHASE_1: ReadonlyArray<string> = [
    "Architect",
    "Prefect",
    "Mercator",
    "Colonist",
    "Diplomat",
    "Mason",
    "Farmer",
    "Smith",
  ];

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
    instance: ReadonlyArray<SetupStep<SetupStepName>>,
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
            const mapDef = instance.find((step) => step.id === "map");
            if (mapDef == null || mapDef.id !== "map") {
              // TODO: create a generic dependancy error
              invariant_violation(`Couldn't find 'map' dependancy`);
            }
            const mapId = mapDef.value;
            const cities = this.CITIES[mapId];
            const hashes = Object.keys(cities).map((zone) => {
              const tiles = this.CITY_TILES[zone as MapZone];
              const permutations = new PermutationsLazyArray(tiles);
              const selectedIdx = Math.floor(
                Math.random() * permutations.length
              );
              return Base64.encode(selectedIdx);
            });
            return hashes.join(":");
        }
        break;

      case "marketDisplay":
        switch (strategy) {
          case Strategy.RANDOM:
            const permutations = PermutationsLazyArray.forPermutation(
              this.MARKET_DECK_PHASE_1
            );
            const selectedIdx = Math.floor(Math.random() * permutations.length);
            return Base64.encode(selectedIdx);
        }
        break;
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
        const strategies = [
          Strategy.OFF,
          Strategy.RANDOM,
          Strategy.ASK,
          Strategy.FIXED,
        ];
        if (playersTotal > 2 && playersTotal < 5) {
          strategies.push(Strategy.DEFAULT);
        }
        return strategies;

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
        if (playersTotal === 0) {
          return [Strategy.OFF];
        }
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
        if (playersTotal < 2) {
          return [Strategy.OFF];
        }
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
