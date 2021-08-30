import invariant_violation from "../../common/err/invariant_violation";
import { GamePiecesColor } from "../../core/themeWithGameColors";
import { SetupStep } from "../../features/instance/instanceSlice";
import PermutationsLazyArray from "../../common/PermutationsLazyArray";
import Base32 from "../../common/Base32";
import nullthrows from "../../common/err/nullthrows";
import IGame, { StepId } from "../IGame";
import IGameStep from "../IGameStep";
import GenericGameStep from "../GenericGameStep";
import MapStep from "./steps/MapStep";
import CityTilesStep from "./steps/CityTilesStep";
import MarketDisplayStep from "./steps/MarketDisplayStep";
import BonusTilesStep from "./steps/BonusTilesStep";
import PlayOrderStep from "../steps/PlayOrderStep";
import StartingColonistsStep from "./steps/StartingColonistsStep";
import StartingMoneyStep from "./steps/StartingMoneyStep";
import { PraefectusMagnusStep } from "./steps/PraefectusMagnusStep";
import FirstPlayerStep from "../steps/FirstPlayerStep";
import PlayerColorsStep from "../steps/PlayerColorsStep";

const HASH_SEPERATOR = "-";

export type MapZone = "A" | "B" | "C" | "D";
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
  public static readonly CITY_TILES: Readonly<
    Record<MapZone, Readonly<Record<Resource, number>>>
  > = {
    A: { bricks: 2, food: 2, tools: 1, wine: 1, cloth: 1 },
    B: { bricks: 2, food: 3, tools: 1, wine: 1, cloth: 1 },
    C: { bricks: 3, food: 2, tools: 2, wine: 2, cloth: 1 },
    D: { bricks: 1, food: 1, tools: 1, wine: 1, cloth: 1 },
  };

  public static readonly MAPS = {
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

  public static readonly MARKET_DECK_PHASE_1: ReadonlyArray<string> = [
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
    this.steps = Object.fromEntries(
      [
        new MapStep(),
        new CityTilesStep(),
        new BonusTilesStep(),
        new GenericGameStep("marketCards"),
        new MarketDisplayStep(),
        new GenericGameStep("marketDeck", "Cards Deck"),
        new GenericGameStep("concordiaCard"),
        new GenericGameStep("resourcePiles"),
        new GenericGameStep("bank"),
        new PlayOrderStep(),
        new PlayerColorsStep(this.playerColors),
        new GenericGameStep("playerPieces", "Player Components"),
        new StartingColonistsStep(),
        new GenericGameStep("startingResources"),
        new FirstPlayerStep(),
        new StartingMoneyStep(),
        new PraefectusMagnusStep(),
      ].map((step) => [step.id, step])
    );
  }

  public at(id: string): IGameStep | undefined {
    return this.steps[id];
  }

  public get order(): StepId[] {
    return Object.values(this.steps).map((step) => step.id);
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

  public get playerColors(): GamePiecesColor[] {
    return ["black", "blue", "green", "red", "yellow"];
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
