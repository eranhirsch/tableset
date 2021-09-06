export type MapId = "italia" | "imperium";

export interface StartingColonistLocation {
  locationName: string;
  type: "land" | "sea";
}

export type Zone = "A" | "B" | "C" | "D";

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

  provinces: Readonly<
    Partial<
      Record<Zone, Readonly<{ [provinceName: string]: readonly string[] }>>
    >
  >;
}>;

export const MAPS: Record<MapId, MapBoard> = Object.freeze({
  italia: {
    name: "Italia",
    tightnessScore: 1.1,
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
    },
  },

  imperium: {
    name: "Imperium",
    tightnessScore: 0.8,
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
