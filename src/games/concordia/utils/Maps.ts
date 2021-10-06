import { ConcordiaProductId } from "../concordiaGame";

export type MapId =
  | "britannia"
  | "byzantium"
  | "germania"
  | "hispania"
  | "imperium"
  | "italia";

export type Zone = "A" | "B" | "C" | "D";

export interface StartingColonistLocation {
  locationName: string;
  type: "land" | "sea";
}

type CityNames = readonly string[];
export type Provinces = Readonly<Record<string /* provinceName */, CityNames>>;

// We can't use `Map` as that's already a thing in js
interface MapBoard {
  name: string;

  /**
   * Products which provide this map
   */
  providedIn: readonly ConcordiaProductId[];

  /**
   * @see https://boardgamegeek.com/thread/2611782/big-forum-post-about-maps, We
   * use the 4 player score here, and simply take different ranges for different
   * player counts, instead of holding the full table
   */
  tightnessScore: number;

  startingColonists: readonly [
    Readonly<StartingColonistLocation>,
    Readonly<StartingColonistLocation>
  ];

  /**
   * Most maps nowadays have a minimap for the province bonus section, but the
   * first editions came with maps with a dedicated area on the board for it
   * instead.
   */
  hasLegacyProvincesSection?: true;

  provinces: Readonly<Partial<Record<Zone, Provinces>>>;

  /**
   * The Salsa expansion added maps which have an extra city in each zone, and
   * it added special setup rules for how to use these maps without salt. We
   * need to mark these maps so we can special-case them in that step.
   */
  isSaltMap?: true;
}

export const MAPS: Readonly<Record<MapId, Readonly<MapBoard>>> = {
  italia: {
    name: "Italia",
    providedIn: ["base"],
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
    },
  },

  imperium: {
    name: "Imperium",
    providedIn: ["base"],
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
    providedIn: ["britanniaGermania"],
    tightnessScore: 1.45,
    startingColonists: [
      { locationName: "Londinivm", type: "land" },
      { locationName: "Portvs Itivs", type: "sea" },
    ],
    provinces: {
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
    providedIn: ["britanniaGermania"],
    tightnessScore: 0.5,
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
        "Agri Decvmates": ["Arae Flaviae", "Constantia", "Grinario"],
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

  byzantium: {
    name: "Byzantium",
    providedIn: ["salsa"],
    tightnessScore: 1.0,
    startingColonists: [
      { locationName: "Byzantivm", type: "land" },
      { locationName: "Byzantivm", type: "sea" },
    ],
    isSaltMap: true,
    provinces: {
      A: {
        Asia: ["Appia", "Ilivm", "Miletvs"],
        Pontvs: ["Amastris", "Ancyra", "Sinope"],
        Scythia: ["Chersonesvs", "Panticapaion"],
      },
      B: {
        Achaea: ["Athenae", "Delphi", "Gortyn", "Sparta"],
        Macedonia: ["Stobi", "Thessalonica"],
        Thracia: ["Apollonia", "Philippopolis", "Tomis"],
      },
      C: {
        Aegyptvs: ["Alexandria", "Gaza", "Petra"],
        Cappadocia: ["Attalia", "Caesarea", "Selevcia"],
        Libya: ["Cyrene", "Zygris"],
        Phcenicia: ["Antiochia", "Salamis", "Tyrvs"],
      },
    },
  },

  hispania: {
    name: "Hispania",
    providedIn: ["salsa"],
    tightnessScore: 1.4,
    startingColonists: [
      { locationName: "Sagvntvm", type: "land" },
      { locationName: "Sagvntvm", type: "sea" },
    ],
    isSaltMap: true,
    provinces: {
      A: {
        Cantabria: ["Pompaelo", "Salamantica"],
        Gallia: ["Massillia", "Narbo Martivs", "Tolosa"],
        Tarraconensis: ["Nova Carthago", "Tarraco", "Toletvm"],
      },
      B: {
        Africa: ["Caesarea", "Carthago", "Thamvgadi"],
        Baetica: ["Cordvba", "Tingis"],
        Gallaecia: ["Bracara", "Brigantivm"],
        Lvsitania: ["Olisipo", "Ossonoba"],
      },
      D: {
        Italia: ["Caesena", "Genva", "Ostia"],
        "Mare Tyrrhenicvm": ["Aleria", "Carales", "Panormvs"],
      },
    },
  },
};
