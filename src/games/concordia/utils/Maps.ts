export type MapId = "italia" | "imperium";

export interface StartingColonistLocation {
  locationName: string;
  type: "land" | "sea";
}

export type Zone = "A" | "B" | "C" | "D";

type CityNames = readonly string[];

export type Provinces = Readonly<{ [provinceName: string]: CityNames }>;

// We can't use `Map` as that's already a thing in js
export type MapBoard = Readonly<{
  name: string;

  /**
   * @see https://boardgamegeek.com/thread/2611782/big-forum-post-about-maps, We
   * use the 4 player score here, and simply take different ranges for different
   * player counts, instead of holding the full table
   */
  tightnessScore: number;

  startingColonists: [StartingColonistLocation, StartingColonistLocation];

  /**
   * Most maps nowadays have a minimap for the province bonus section, but the
   * first editions came with maps with a dedicated area on the board for it
   * instead.
   */
  hasMinimap: boolean;

  provinces: Readonly<Record<Zone, Provinces | null>>;
}>;

export const MAPS: Record<MapId, MapBoard> = Object.freeze({
  italia: {
    name: "Italia",
    tightnessScore: 1.1,
    hasMinimap: false,
    startingColonists: [
      { locationName: "Roma", type: "land" },
      { locationName: "Roma", type: "sea" },
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
      D: null,
    },
  },

  imperium: {
    name: "Imperium",
    tightnessScore: 0.8,
    hasMinimap: false,
    startingColonists: [
      { locationName: "Roma", type: "land" },
      { locationName: "Roma", type: "sea" },
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
});
