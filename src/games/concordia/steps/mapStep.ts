import createGenericItemsGameStep from "../../core/steps/createGenericItemsGameStep";
import ConcordiaMap from "../ux/ConcordiaMap";

export type Zone = "A" | "B" | "C" | "D";

export type MapId = "italia" | "imperium";

export interface StartingColonistLocation {
  placement: string;
  type: "land" | "sea";
}

// We can't use `Map` as that's already a thing in js
export type MapBoard = Readonly<{
  name: string;
  startingColonists: [StartingColonistLocation, StartingColonistLocation];
  provinces: Readonly<
    Partial<
      Record<Zone, Readonly<{ [provinceName: string]: readonly string[] }>>
    >
  >;
}>;

export const MAPS: Record<MapId, MapBoard> = {
  italia: {
    name: "Italia",
    startingColonists: [
      { placement: "Roma", type: "land" },
      { placement: "Roma", type: "sea" },
    ],
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
    startingColonists: [
      { placement: "Roma", type: "land" },
      { placement: "Roma", type: "sea" },
    ],
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

export default createGenericItemsGameStep({
  id: "map",
  itemIds: Object.keys(MAPS) as MapId[],

  labelFor: (id) => MAPS[id].name,
  render: ConcordiaMap,

  isType: (x: string): x is MapId => MAPS[x as MapId] != null,
  recommended: ({ playerIds }) =>
    playerIds.length <= 1
      ? undefined
      : playerIds.length <= 3
      ? "italia"
      : playerIds.length <= 5
      ? "imperium"
      : undefined,
});
