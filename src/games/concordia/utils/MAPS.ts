import { Dict, Vec } from "common";
import { ConcordiaProductId } from "../ConcordiaProductId";

export type MapId =
  | "aegyptus"
  | "balearica"
  | "britannia"
  | "byzantium"
  | "corsica"
  | "creta"
  | "cyprus"
  | "gallia"
  | "germania"
  | "hellas"
  | "hispania"
  | "imperium"
  | "ionium"
  | "ioniumSmall"
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

  /**
   * Does the map have a personality cards market printed directly on the board.
   * All legacy maps had this, only new maps in Venus and in one map expansion
   * don't have the market and instead provide an external market board.
   */
  hasIntegratedCardsMarket?: true;
}

export const MAPS: Readonly<Record<MapId, Readonly<MapBoard>>> = {
  /* spell-checker: disable */
  italia: {
    name: "Italia",
    providedIn: ["base", "balearicaItalia"],
    tightnessScore: 1.1,
    hasLegacyProvincesSection: true,
    hasIntegratedCardsMarket: true,
    startingColonists: [
      { locationName: "Roma", type: "land" },
      { locationName: "Roma", type: "sea" },
    ],
    provinces: {
      A: {
        Ligvria: ["Genva", "Nicaea"],
        Transpadana: ["Comvm", "Segvsio"],
        Venetia: ["Aqvileia", "Bavsanvm", "Verona"],
      },
      B: {
        Aemilia: ["Mvtina", "Ravenna"],
        Campania: ["Casinvm", "Neapolis"],
        Corsica: ["Aleria", "Olbia"],
        Etrvria: ["Cosa", "Florentia"],
      },
      C: {
        Apvlia: ["Brvndisivm", "Lvcria"],
        Lvcania: ["Croton", "Potentia"],
        Sicilia: ["Messana", "Panormvs", "Syracvsae"],
        Umbria: ["Ancona", "Hadria", "Spoletvm"],
      },
    },
  },

  imperium: {
    name: "Imperivm",
    providedIn: ["base", "venusBase"],
    tightnessScore: 0.8,
    hasLegacyProvincesSection: true,
    hasIntegratedCardsMarket: true,
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
        Gallia: ["Bvrdigala", "Lvtetia", "Massilia"],
        Hispania: ["Brigantivm", "Olisipo", "Valentia"],
        Mavretania: ["Carthago", "Rvsadir"],
      },
      C: {
        Aegyptvs: ["Alexandria", "Memphis", "Petra"],
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
    hasIntegratedCardsMarket: true,
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
    hasIntegratedCardsMarket: true,
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
    name: "Byzantivm",
    providedIn: ["salsa"],
    tightnessScore: 1.0,
    hasIntegratedCardsMarket: true,
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
        Phoenicia: ["Antiochia", "Salamis", "Tyrvs"],
      },
    },
  },

  hispania: {
    name: "Hispania",
    providedIn: ["salsa"],
    tightnessScore: 1.4,
    hasIntegratedCardsMarket: true,
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

  gallia: {
    name: "Gallia",
    providedIn: ["galliaCorsica"],
    tightnessScore: 1.4,
    hasIntegratedCardsMarket: true,
    startingColonists: [
      { type: "land", locationName: "Lvtetia" },
      { type: "sea", locationName: "in the sea near Massilia and Genva" },
    ],
    provinces: {
      A: {
        Belgica: ["A. Treverorvm", "Bononia", "Civ. Remorvm"],
        "Britannia Inferior": ["Branodvnvm", "Londinivm"],
        "Britannia Svperior": ["Glevvm", "Isca Dvnm."],
      },
      B: {
        Aqvitania: ["Avaricvm", "Bvrdigala", "Gergovia"],
        "Gallia Narbonensis": ["Massilia", "Narbo Martivs", "Tolosa"],
        Hispania: ["Flaviobriga", "Pompaelo"],
      },
      C: {
        Aremorica: ["Condate", "Gesocribate", "Portvs Namnetvs"],
        "Gallia Lvgdvnensis": ["Alesia", "Jvliobona", "Lvgdvnvm"],
        Helvetia: ["Aventicvm", "Tvricvm"],
        Italia: ["Vercellae", "Genva"],
      },
    },
  },

  corsica: {
    name: "Corsica",
    providedIn: ["galliaCorsica"],
    tightnessScore: 2.1,
    hasIntegratedCardsMarket: true,
    startingColonists: [
      { type: "land", locationName: "Aleria" },
      { type: "sea", locationName: "Aleria" },
    ],
    provinces: {
      A: {
        Blue: ["Kanelate", "Mantinon", "Vicvs Avrelianvs"],
        Yellow: ["Castellvm", "Palania"],
        Red: ["Talkinon", "Montanvs"],
      },
      B: {
        Green: ["Adiacivm", "Alovka", "Saone"],
        Cyan: ["Matisa", "Pavka", "Titianos"],
        Brown: ["Albiana", "Palla"],
      },
      D: {
        Orange: ["Favoni Portvs", "Praesidivm", "Vicvs"],
        Grey: ["Mariana", "Opinon"],
      },
    },
  },

  aegyptus: {
    name: "Aegyptvs",
    providedIn: ["aegyptusCreta"],
    tightnessScore: 1.9,
    startingColonists: [
      { type: "land", locationName: "Memphis" },
      { type: "sea", locationName: "Memphis" },
    ],
    provinces: {
      A: {
        Arabia: ["Aila", "Levke Kome", "Petra"],
        Ivdaea: ["Gaza", "Jervsalem"],
        Sinai: ["Klysma", "Rhaithov"],
      },
      C: {
        "Aegyptvs Svperior": ["Syene", "Thebae"],
        Arcadia: ["Lyopolis", "Oxyrhynchvs"],
        Kvsh: ["Meroe", "Napata"],
        Litvs: ["Berenice", "Myos Hormos"],
        Nvbia: ["Abv Simbel", "Kerma"],
      },
      D: {
        "Aegyptvs Inferior": ["Alexandria", "Tamiathis"],
        Oasis: ["Hibis", "Oasis Parva", "Trimithis"],
      },
    },
  },

  creta: {
    name: "Creta",
    providedIn: ["aegyptusCreta"],
    tightnessScore: 2.2,
    startingColonists: [
      { type: "land", locationName: "Knosis" },
      { type: "sea", locationName: "Knosis" },
    ],
    provinces: {
      A: {
        Red: ["Kydonia", "Phalasarna", "Polyrrhenia"],
        Yellow: ["Biennos", "Elyros", "Tarrha"],
        Brown: ["Gavdos"],
      },
      B: {
        Green: ["Lappa", "Rhethymna"],
        Purple: ["Elevtherna", "Psycheion"],
        Blue: ["Gortyn", "Matalon"],
        Orange: ["Hierapytna", "Inatos"],
      },
      D: {
        Grey: ["Chersonasos", "Lyktos", "Olvs"],
        Olive: ["Itanos", "Praisos"],
      },
    },
  },

  ionium: {
    name: "Ionivm",
    providedIn: ["venus", "venusBase"],
    tightnessScore: 0.9,
    startingColonists: [
      { type: "land", locationName: "Athenae" },
      { type: "sea", locationName: "Athenae" },
    ],
    provinces: {
      A: {
        Dardania: ["Philippopolis", "Scodra", "Scvpi"],
        Epirvs: ["Ambrakia", "Apollonia"],
        Macedonia: ["Larissa", "Thessalonica"],
      },
      B: {
        Calabria: ["Brvndisivm", "Heraclea"],
        Campania: ["Canvsivm", "Neapolis", "Terventvm"],
        Sicilia: ["Croton", "Messana", "Syracvsae"],
      },
      C: {
        Asia: ["Colossae", "Hadrianoi"],
        Ionia: ["Dardanos", "Ephesvs", "Pergamon"],
        Rhodos: ["Patara", "Rhodos"],
        Thracia: ["Abdera", "Byzantivm", "Hadrianopolis"],
      },
      D: {
        Achaia: ["Delphi", "Patrae"],
        Sparta: ["Heraklion", "Lepreon", "Sparta"],
      },
    },
  },

  ioniumSmall: {
    name: "Ionivm (Small)",
    providedIn: ["venus", "venusBase"],
    tightnessScore: 2.0,
    startingColonists: [
      { type: "land", locationName: "Athenae" },
      { type: "sea", locationName: "Athenae" },
    ],
    provinces: {
      A: {
        Dardania: ["Philippopolis", "Scodra", "Scvpi"],
        Epirvs: ["Ambrakia", "Apollonia"],
        Macedonia: ["Larissa", "Thessalonica"],
      },
      C: {
        Asia: ["Colossae", "Hadrianoi"],
        Ionia: ["Dardanos", "Ephesvs", "Pergamon"],
        Rhodos: ["Patara", "Rhodos"],
        Thracia: ["Abdera", "Byzantivm", "Hadrianopolis"],
      },
      D: {
        Achaia: ["Delphi", "Patrae"],
        Sparta: ["Heraklion", "Lepreon", "Sparta"],
      },
    },
  },

  hellas: {
    name: "Hellas",
    providedIn: ["venus", "venusBase"],
    tightnessScore: 1.2,
    hasIntegratedCardsMarket: true,
    startingColonists: [
      { type: "land", locationName: "Athenae" },
      { type: "sea", locationName: "Athenae" },
    ],
    provinces: {
      A: {
        Epirvs: ["Kephallenia", "Nicopolis", "Zakhynthos"],
        Locris: ["Delphi", "Thermos"],
        Thessalia: ["Demetrias", "Metropolis"],
      },
      B: {
        Cyclades: ["Melos", "Naxos", "Thera"],
        Evboea: ["Chalcis", "Karystos", "Oreos"],
        Sporades: ["Psyra", "Skyros"],
      },
      C: {
        Attica: ["Corinthvs", "Thebae"],
        Argolis: ["Argos", "Hermione"],
        Achaia: ["Megalopolis", "Olympia", "Patrae"],
        Laconia: ["Methone", "Sparta"],
      },
    },
  },

  balearica: {
    name: "Balearica",
    providedIn: ["balearicaCyprus", "balearicaItalia"],
    tightnessScore: 1.5,
    hasIntegratedCardsMarket: true,
    startingColonists: [
      { type: "sea", locationName: "the boat near Ebvssvm" },
      { type: "sea", locationName: "the boat near Minorica" },
    ],
    provinces: {
      A: {
        Brown: ["Andrachivm", "Palmaria"],
        Green: ["Cvbvs", "Ebvssvs", "Frvmentaria"],
        Yellow: ["Nigrvm", "Portvs Magnvs"],
      },
      C: {
        Cyan: ["Selva", "Soller"],
        Gray: ["Fenalicivm", "Sanctvs Agninvs", "Servariopolis"],
        Olive: ["Lvcvs Maior", "Rapidvs"],
        Orange: ["Arta", "Bocchoris", "Pollentia"],
      },
      D: {
        Purple: ["Argentvm", "Mago"],
        Red: ["Fornix", "Iamno", "Tvrris Solis"],
      },
    },
  },

  cyprus: {
    name: "Cyprus",
    providedIn: ["balearicaCyprus", "venusBase"],
    tightnessScore: 0.7,
    startingColonists: [
      { type: "land", locationName: "Antiochia" },
      { type: "sea", locationName: "Antiochia" },
    ],
    provinces: {
      A: {
        Cyan: ["Paphos", "Soloi"],
        Red: ["Karpasia", "Keryneia", "Salamis"],
        Yellow: ["Amathovs", "Kition"],
      },
      B: {
        Blue: ["Germanikeia", "Samosata", "Zevgma"],
        Maroon: ["Anazarbvs", "Mallvs", "Tarsvs"],
        Orange: ["Alexandria A.I.", "Cyrrhvs"],
      },
      C: {
        Gold: ["Palmyra", "Resafa", "Seriane"],
        Gray: ["Apamea", "Laodiceia"],
        Green: ["Chalcis A.B.", "Hierapolis"],
        Purple: ["Arados", "Hemesa", "Tripolis"],
      },
      D: {
        Brown: ["Anemvrivm", "Germanicopolis", "Korakesion"],
        Olive: ["Selevcia", "Tyana"],
      },
    },
  },
  /* spell-checker: enable */
};

export const mapsForProducts = (
  activeProducts: readonly ConcordiaProductId[]
): readonly MapId[] =>
  Vec.keys(
    Dict.filter(MAPS, ({ providedIn }) =>
      providedIn.some((productId) => activeProducts.includes(productId))
    )
  );

export const productsWithMaps = (): readonly ConcordiaProductId[] =>
  Vec.unique(
    Vec.flatten(Vec.map_with_key(MAPS, (_, { providedIn }) => providedIn))
  );
