import { Strategy } from "../../../core/Strategy";
import { ConstantTemplateElement } from "../../../features/template/templateSlice";
import IGameStep, { InstanceContext, TemplateContext } from "../../IGameStep";

export type Zone = "A" | "B" | "C" | "D";

export type MapId = "italia" | "imperium";

// We can't use `Map` as that's already a thing in js
type MapBoard = Readonly<{
  name: string;
  provinces: Readonly<
    Partial<
      Record<Zone, Readonly<{ [provinceName: string]: readonly string[] }>>
    >
  >;
}>;

export const MAPS: Record<MapId, MapBoard> = {
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
  },

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
  },
};

export default class MapStep implements IGameStep {
  public readonly id: string = "map";
  public readonly label: string = "Map";

  public resolveRandom(): string {
    return this.items[Math.floor(Math.random() * this.items.length)];
  }

  public resolveDefault({ playersTotal }: InstanceContext): string {
    // Using typescript to verify the Ids here are valid
    const recommendedMap: MapId = playersTotal < 4 ? "italia" : "imperium";
    return recommendedMap;
  }

  public get items(): string[] {
    return Object.keys(MAPS);
  }

  public labelForItem(value: string): string {
    return MAPS[value as MapId].name;
  }

  public strategies({ playersTotal }: TemplateContext): Strategy[] {
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
  }

  public initialFixedValue?(playerIds: string[]): ConstantTemplateElement {
    return {
      id: this.id,
      strategy: Strategy.FIXED,
      global: false,
      value: this.items[0],
    };
  }
}
