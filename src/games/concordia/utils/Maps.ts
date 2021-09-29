export const MAPS = Object.freeze({
  italia: {
    name: "Italia",
    tightnessScore: 1.1,
    hasLegacyProvincesSection: true,
    startingColonists: [
      { locationName: "Roma", type: "land" },
      { locationName: "Roma", type: "sea" },
    ],
    provinces: {
      A: {
        Liguria: ["Genva", "Nicaea"],
        Transpadana: ["Comvm", "Segvsio"],
        Venetia: ["Aqvileia", "Bavsanvm", "Verona"],
      },
      B: {
        Aemilia: ["Mvtina", "Ravenna"],
        Campania: ["Casinvm", "Neapolis"],
        Corsica: ["Aleria", "Olbia"],
        Etruria: ["Cosa", "Florentia"],
      },
      C: {
        Apulia: ["Brvndisivm", "Lvcria"],
        Lucania: ["Croton", "Potentia"],
        Sicilia: ["Messana", "Panormvs", "Syracvsae"],
        Umbria: ["Ancona", "Hadria", "Spoletvm"],
      },
      D: null,
    },
  },

  imperium: {
    name: "Imperium",
    tightnessScore: 0.8,
    hasLegacyProvincesSection: true,
    startingColonists: [
      { locationName: "Roma", type: "land" },
      { locationName: "Roma", type: "sea" },
    ],
    provinces: {
      A: {
        Britannia: ["Isca D.", "Londinivm"],
        Dacia: ["Napoca", "Sirmivm", "Tomis"],
        Germania: ["Colonia A.", "Vindobona"],
      },
      B: {
        Galia: ["Bvrdigala", "Lvtetia", "Massilia"],
        Hispania: ["Brigantivm", "Olisipo", "Valentia"],
        Mauretania: ["Carthago", "Rvsadir"],
      },
      C: {
        Aegyptus: ["Alexandria", "Memphis", "Petra"],
        Asia: ["Attalia", "Bycantivm", "Sinope"],
        Lybia: ["Cyrene", "Leptis Magna"],
        Syria: ["Antiochia", "Tyros"],
      },
      D: {
        Hellas: ["Athenae", "Dirrhachivm"],
        Italia: ["Aqvileia", "Novaria", "Syracvsae"],
      },
    },
  },

  britannia: {
    name: "Britannia",
    tightnessScore: 1.45,
    startingColonists: [
      { locationName: "Londinivm", type: "land" },
      { locationName: "Portvs Itivs", type: "sea" },
    ],
    provinces: {
      A: null,
      B: {
        Brigantia: ["Deva", "Mancvnivm", "Monapia"],
        Caledonia: ["Lvgvvalivm", "Pons Aelii", "Trimontivm"],
        Isvria: ["Cataractonivm", "Ebvracvm"],
      },
      C: {
        Cambria: ["Maridvnvm", "Segontivm"],
        Dobvni: ["Glevvm", "Venonis"],
        Dvmnonia: ["Isca Dvmnon", "Mvsidvnvm"],
        Icenivm: ["Branodvnvm", "Lindvm"],
        Trinovantivm: ["Camvlodvnvm", "Dvrolipnos"],
      },
      D: {
        Cantivm: ["Dvbris", "Noviomagvs"],
        Dvrotrigvm: ["Aqvae Svlis", "Dvrnovaria", "Venta"],
      },
    },
  },

  germania: {
    name: "Germania",
    tightnessScore: 0.5, // TODO: The site was down, this isn't the correct value
    startingColonists: [
      { locationName: "Basilia", type: "land" },
      { locationName: "Colonia Agr.", type: "sea" },
    ],
    provinces: {
      A: {
        Batavia: ["Traiectvm", "Villa Optima", "Vlpia Noviomagvs"],
        Brvcteri: ["Aliso", "Vlpia Traiana"],
        Vbii: ["Bonna", "Novaesivm"],
      },
      B: {
        Belgica: ["Avg. Treverorvm", "Divodvrvm", "Icorigivm"],
        Francia: ["Conflventes", "Mogonatiacvm", "Nida"],
        Nemetes: ["Noviomagvs", "Segodvnvm"],
      },
      C: {
        AgriDecvmates: ["Arae Flaviae", "Constantia", "Grinario"],
        Alamannia: ["Argentorate", "Brisiacvs"],
        Gallia: ["Vesontio", "Condate", "Tvllvm"],
        Raetia: ["Avg. Vindelicvm", "Biriciana"],
      },
      D: {
        Alpes: ["Brigantivm", "Cambodvnvm", "Parthanvm"],
        Helvetia: ["Salodvrvm", "Tvricvm"],
      },
    },
  },
} as Record<string, MapBoard>);

export type MapId = keyof typeof MAPS;

// We can't use `Map` as that's already a thing in js
interface MapBoard {
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
  hasLegacyProvincesSection?: true;

  provinces: Readonly<Record<Zone, Provinces | null>>;
}

export interface StartingColonistLocation {
  locationName: string;
  type: "land" | "sea";
}

export type Zone = "A" | "B" | "C" | "D";

type CityNames = readonly string[];
export type Provinces = Readonly<{ [provinceName: string]: CityNames }>;
