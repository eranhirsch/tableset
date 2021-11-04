import { Dict, MathUtils, nullthrows, Vec } from "common";
import { ScytheProductId } from "../ScytheProductId";

export type MatId =
  | "agricultural"
  | "engineering"
  | "industrial"
  | "innovative"
  | "mechanical"
  | "militant"
  | "patriotic";

interface Mat {
  name: string;
  rank: string;
  popularity: number;
  cash: number;
}

const PLAYER_MATS: Readonly<Record<MatId, Readonly<Mat>>> = {
  agricultural: { name: "Agricultural", rank: "5", popularity: 4, cash: 7 },
  engineering: { name: "Engineering", rank: "2", popularity: 2, cash: 5 },
  industrial: { name: "Industrial", rank: "1", popularity: 2, cash: 4 },
  innovative: { name: "Innovative", rank: "3a", popularity: 3, cash: 5 },
  mechanical: { name: "Mechanical", rank: "4", popularity: 3, cash: 6 },
  militant: { name: "Militant", rank: "2a", popularity: 3, cash: 4 },
  patriotic: { name: "Patriotic", rank: "3", popularity: 2, cash: 6 },
};

const MATS_IN_PRODUCTS: Readonly<
  Partial<Record<ScytheProductId, readonly MatId[]>>
> = {
  base: [
    "agricultural",
    "engineering",
    "industrial",
    "mechanical",
    "patriotic",
  ],
  invaders: ["innovative", "militant"],
};

export const PlayerMats = {
  ...PLAYER_MATS,

  decode: (
    idx: number,
    playerCount: number,
    products: readonly ScytheProductId[]
  ): readonly MatId[] =>
    nullthrows(
      MathUtils.combinations_lazy_array(
        availableForProducts(products),
        playerCount
      ).at(idx),
      `Mats idx ${idx} was out of range for products ${JSON.stringify(
        products
      )}`
    ),

  encode: (
    matIds: readonly MatId[],
    playerCount: number,
    products: readonly ScytheProductId[]
  ): number =>
    MathUtils.combinations_lazy_array(
      availableForProducts(products),
      playerCount
    ).indexOf(matIds),

  availableForProducts,
} as const;

function availableForProducts(
  products: readonly ScytheProductId[]
): readonly MatId[] {
  return Vec.flatten(Vec.values(Dict.select_keys(MATS_IN_PRODUCTS, products)));
}
