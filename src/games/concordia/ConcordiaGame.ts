import { Dictionary } from "@reduxjs/toolkit";
import invariant_violation from "../../common/err/invariant_violation";
import { TemplateElement } from "../../features/template/templateSlice";
import { Strategy } from "../../core/Strategy";
import { GamePiecesColor } from "../../core/themeWithGameColors";
import { SetupStep } from "../../features/instance/instanceSlice";
import PermutationsLazyArray from "../../common/PermutationsLazyArray";
import Base32 from "../../common/Base32";
import nullthrows from "../../common/err/nullthrows";
import array_zip from "../../common/lib_utils/array_zip";

const HASH_SEPERATOR = "-";

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
  | "startingMoney"
  | "startingResources";

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

  private static readonly MAPS = {
    italia: {
      name: "Italia",
      cities: {
        A: [
          "Bavsanvm",
          "Aqvileia",
          "Verona",
          "Comvm",
          "Segvsio",
          "Nicaea",
          "Genva",
        ],
        B: [
          "Mvtina",
          "Ravenna",
          "Florentia",
          "Cosa",
          "Aleria",
          "Olbia",
          "Casinvm",
          "Neapolis",
        ],
        C: [
          "Ancona",
          "Spoletvm",
          "Hadria",
          "Lvcria",
          "Brvndisivm",
          "Potentia",
          "Croton",
          "Messana",
          "Syracvsae",
          "Panormvs",
        ],
      },
    },
    imperium: {
      name: "Imperium",
      cities: {
        A: [
          "Isca D.",
          "Londonivm",
          "Colonia A.",
          "Vindobona",
          "Sirmivm",
          "Napoca",
          "Tomis",
        ],
        B: [
          "Lvtetia",
          "Bvrdigala",
          "Massilia",
          "Brigantivm",
          "Olisipo",
          "Valentia",
          "Rvsadir",
          "Carthago",
        ],
        C: [
          "Leptis Magna",
          "Cyrene",
          "Bycantivm",
          "Sinope",
          "Attalia",
          "Antiochia",
          "Tyros",
          "Alexandria",
          "Memphis",
          "Petra",
        ],
        D: ["Novaria", "Aqvileia", "Syracvsae", "Dirrhachivm", "Athenae"],
      },
    },
  } as const;

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
      "startingResources",
      "firstPlayer",
      "startingMoney",
      "praefectusMagnus",
    ];
  }

  public static resolveRandom(
    stepId: SetupStepName,
    instance: ReadonlyArray<SetupStep<SetupStepName>>,
    playersTotal: number
  ): string {
    switch (stepId) {
      case "map":
        const items = this.itemsForStep(stepId);
        return items[Math.floor(Math.random() * items.length)];

      case "cityTiles":
        const mapDef = instance.find((step) => step.id === "map");
        if (mapDef == null || mapDef.id !== "map") {
          // TODO: create a generic dependancy error
          invariant_violation(`Couldn't find 'map' dependancy`);
        }
        const mapId = mapDef.value as keyof typeof ConcordiaGame.MAPS;
        const cities = this.MAPS[mapId].cities;
        const hashes = Object.keys(cities).map((zone) => {
          const tiles = this.CITY_TILES[zone as MapZone];
          const permutations = new PermutationsLazyArray(tiles);
          const selectedIdx = Math.floor(Math.random() * permutations.length);
          return Base32.encode(selectedIdx);
        });
        return hashes.join(HASH_SEPERATOR);

      case "marketDisplay":
        const permutations = PermutationsLazyArray.forPermutation(
          this.MARKET_DECK_PHASE_1
        );
        const selectedIdx = Math.floor(Math.random() * permutations.length);
        return Base32.encode(selectedIdx);
    }

    invariant_violation(
      `Step ${stepId} could not be resolved with RANDOM strategy`
    );
  }

  public static resolveDefault(
    stepId: SetupStepName,
    instance: ReadonlyArray<SetupStep<SetupStepName>>,
    playersTotal: number
  ): string {
    switch (stepId) {
      case "map":
        const recommendedMap: keyof typeof ConcordiaGame.MAPS =
          playersTotal < 4 ? "italia" : "imperium";
        return recommendedMap;
    }

    invariant_violation(
      `Step ${stepId} could not be resolved with DEFAULT strategy`
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
        if (playersTotal >= 2 && playersTotal <= 5) {
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
        if (playersTotal < 3 || playersTotal > 5) {
          return [Strategy.OFF];
        }
        return [Strategy.OFF, Strategy.RANDOM, Strategy.ASK, Strategy.FIXED];

      case "playerColors":
        if (playersTotal === 0 || playersTotal > 5) {
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
        if (playersTotal < 2 || playersTotal > 5) {
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

  public static itemsForStep(stepId: SetupStepName): readonly string[] {
    switch (stepId) {
      case "map":
        return Object.keys(this.MAPS);

      default:
        invariant_violation(
          `No items for step ${stepId}, the step shouldn't have FIXED strategy enabled for it`
        );
    }
  }

  public static labelForItem(stepId: SetupStepName, value: string): string {
    switch (stepId) {
      case "map":
        return this.MAPS[value as keyof typeof ConcordiaGame.MAPS].name;

      default:
        invariant_violation(
          `No labels defined for step ${stepId} and value ${value}`
        );
    }
  }

  public static cityResources(
    map: string,
    hash: string
  ): { [cityName: string]: Resource } {
    const hashParts = hash.split(HASH_SEPERATOR);
    return Object.entries(
      this.MAPS[map as keyof typeof ConcordiaGame.MAPS].cities
    ).reduce((result, [zone, cities], index) => {
      const zoneDef = this.CITY_TILES[zone as MapZone];
      const permutationIdx = Base32.decode(hashParts[index]);
      const resources = nullthrows(
        new PermutationsLazyArray(zoneDef).at(permutationIdx)
      );
      return { ...result, ...array_zip(cities, resources) };
    }, {} as { [cityName: string]: Resource });
  }

  public static getMarketForHash(hash: string): ReadonlyArray<string> {
    const permutationIdx = Base32.decode(hash);
    return nullthrows(
      PermutationsLazyArray.forPermutation(this.MARKET_DECK_PHASE_1).at(
        permutationIdx
      )
    ).slice(0, 7);
  }
}
