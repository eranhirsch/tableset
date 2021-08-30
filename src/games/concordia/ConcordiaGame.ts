import { Dictionary } from "@reduxjs/toolkit";
import invariant_violation from "../../common/err/invariant_violation";
import { TemplateElement } from "../../features/template/templateSlice";
import { Strategy } from "../../core/Strategy";
import { GamePiecesColor } from "../../core/themeWithGameColors";
import { SetupStep } from "../../features/instance/instanceSlice";
import PermutationsLazyArray from "../../common/PermutationsLazyArray";
import Base32 from "../../common/Base32";
import nullthrows from "../../common/err/nullthrows";
import IGame, { GenericGameStep, IGameStep, StepId } from "../Game";

const HASH_SEPERATOR = "-";

type MapZone = "A" | "B" | "C" | "D";
type Resource = "bricks" | "food" | "tools" | "wine" | "cloth";

type ConcordiaMap = Readonly<{
  name: string;
  provinces: Readonly<
    Partial<
      Record<MapZone, Readonly<{ [provinceName: string]: readonly string[] }>>
    >
  >;
}>;

export default class ConcordiaGame implements IGame {
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
      provinces: {
        A: {
          Venetia: ["Bavsanvm", "Aqvileia", "Verona"],
          Transpadana: ["Comvm", "Segvsio"],
          Liguria: ["Nicaea", "Genva"],
        },
        B: {
          Aemilia: ["Mvtina", "Ravenna"],
          Etruria: ["Florentia", "Cosa"],
          Corsica: ["Aleria", "Olbia"],
          Campania: ["Casinvm", "Neapolis"],
        },
        C: {
          Umbria: ["Ancona", "Spoletvm", "Hadria"],
          Apulia: ["Lvcria", "Brvndisivm"],
          Lucania: ["Potentia", "Croton"],
          Sicilia: ["Messana", "Syracvsae", "Panormvs"],
        },
      },
    } as ConcordiaMap,
    imperium: {
      name: "Imperium",
      provinces: {
        A: {
          Britannia: ["Isca D.", "Londonivm"],
          Germania: ["Colonia A.", "Vindobona"],
          Dacia: ["Sirmivm", "Napoca", "Tomis"],
        },
        B: {
          Galia: ["Lvtetia", "Bvrdigala", "Massilia"],
          Hispania: ["Brigantivm", "Olisipo", "Valentia"],
          Mauretania: ["Rvsadir", "Carthago"],
        },
        C: {
          Lybia: ["Leptis Magna", "Cyrene"],
          Asia: ["Bycantivm", "Sinope", "Attalia"],
          Syria: ["Antiochia", "Tyros"],
          Aegyptus: ["Alexandria", "Memphis", "Petra"],
        },
        D: {
          Italia: ["Novaria", "Aqvileia", "Syracvsae"],
          Hellas: ["Dirrhachivm", "Athenae"],
        },
      },
    } as ConcordiaMap,
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

  private readonly steps: Readonly<{ [id: string]: IGameStep }>;

  public constructor() {
    this.steps = {
      map: new GenericGameStep("map"),
      cityTiles: new GenericGameStep("cityTiles", "City Resources"),
      bonusTiles: new GenericGameStep("bonusTiles", "Province Bonus"),
      marketCards: new GenericGameStep("marketCards"),
      marketDisplay: new GenericGameStep("marketDisplay", "Cards Display"),
      marketDeck: new GenericGameStep("marketDeck", "Cards Deck"),
      concordiaCard: new GenericGameStep("concordiaCard"),
      resourcePiles: new GenericGameStep("resourcePiles"),
      bank: new GenericGameStep("bank"),
      playOrder: new GenericGameStep("playOrder", "Seating"),
      playerColors: new GenericGameStep("playerColors", "Colors"),
      playerPieces: new GenericGameStep("playerPieces", "Player Components"),
      startingColonists: new GenericGameStep("startingColonists"),
      startingResources: new GenericGameStep("startingResources"),
      firstPlayer: new GenericGameStep("firstPlayer"),
      startingMoney: new GenericGameStep("startingMoney"),
      praefectusMagnus: new GenericGameStep("praefectusMagnus"),
    };
  }

  public get order(): StepId[] {
    return Object.values(this.steps).map((step) => step.id);
  }

  public stepLabel(id: StepId): string {
    return this.steps[id].label;
  }

  public resolveRandom(
    stepId: StepId,
    instance: ReadonlyArray<SetupStep>,
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
        const { provinces } = ConcordiaGame.MAPS[mapId];
        const hashes = Object.keys(provinces).map((zone) => {
          const tiles = ConcordiaGame.CITY_TILES[zone as MapZone];
          const permutations = new PermutationsLazyArray(tiles);
          const selectedIdx = Math.floor(Math.random() * permutations.length);
          return Base32.encode(selectedIdx);
        });
        return hashes.join(HASH_SEPERATOR);

      case "marketDisplay":
        const permutations = PermutationsLazyArray.forPermutation(
          ConcordiaGame.MARKET_DECK_PHASE_1
        );
        const selectedIdx = Math.floor(Math.random() * permutations.length);
        return Base32.encode(selectedIdx);
    }

    invariant_violation(
      `Step ${stepId} could not be resolved with RANDOM strategy`
    );
  }

  public resolveDefault(
    stepId: StepId,
    instance: ReadonlyArray<SetupStep>,
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

  public strategiesFor(
    stepId: StepId,
    template: Dictionary<TemplateElement>,
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

  public get playerColors(): GamePiecesColor[] {
    return ["black", "blue", "green", "red", "yellow"];
  }

  public itemsForStep(stepId: StepId): readonly string[] {
    switch (stepId) {
      case "map":
        return Object.keys(ConcordiaGame.MAPS);

      default:
        invariant_violation(
          `No items for step ${stepId}, the step shouldn't have FIXED strategy enabled for it`
        );
    }
  }

  public labelForItem(stepId: StepId, value: string): string {
    switch (stepId) {
      case "map":
        return ConcordiaGame.MAPS[value as keyof typeof ConcordiaGame.MAPS]
          .name;

      default:
        invariant_violation(
          `No labels defined for step ${stepId} and value ${value}`
        );
    }
  }

  public static cityResources(
    map: string,
    hash: string
  ): Readonly<{
    [provinceName: string]: Readonly<{ [cityName: string]: Resource }>;
  }> {
    const hashParts = hash.split(HASH_SEPERATOR);
    const { provinces } = this.MAPS[map as keyof typeof ConcordiaGame.MAPS];
    const x = Object.entries(provinces).reduce(
      (result, [zone, provinces], index) => {
        const zoneDef = this.CITY_TILES[zone as MapZone];
        const permutationIdx = Base32.decode(hashParts[index]);
        const resources = [
          ...nullthrows(new PermutationsLazyArray(zoneDef).at(permutationIdx)),
        ];

        Object.entries(provinces).forEach(([provinceName, cities]) => {
          const mappedResources: { [cityName: string]: Resource } = {};
          cities.forEach((cityName) => {
            mappedResources[cityName] = nullthrows(
              resources.pop(),
              `Not enough items in the resources permutation!`
            );
          });
          result[provinceName] = mappedResources;
        });

        return result;
      },
      {} as { [provinceName: string]: { [cityName: string]: Resource } }
    );
    return x;
  }

  public static bonusResources(
    resources: Readonly<{
      [provinceName: string]: Readonly<{ [cityName: string]: Resource }>;
    }>
  ): Readonly<{ [provinceName: string]: Resource }> {
    return Object.fromEntries(
      Object.entries(resources).map(([provinceName, cities]) => [
        provinceName,
        Object.values(cities).reduce((highest, resource) => {
          const options = [highest, resource];
          return options.includes("cloth")
            ? "cloth"
            : options.includes("wine")
            ? "wine"
            : options.includes("tools")
            ? "tools"
            : options.includes("food")
            ? "food"
            : "bricks";
        }),
      ])
    );
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
