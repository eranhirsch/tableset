import { MathUtils, nullthrows, Vec } from "common";
import { HexType } from "./HexType";

interface TileSide {
  center: HexType;
  // Corner is the top left corner
  corner: HexType;
  // tile locations are 0-index from left to right and then top to bottom:
  //   0 1
  //   2 3
  illegalLocation: number;
}

const TILES: readonly (readonly [TileSide, TileSide])[] = [
  [
    { corner: "village", center: "forest", illegalLocation: 1 },
    { corner: "tundra", center: "village", illegalLocation: 2 },
  ],
  [
    { corner: "tundra", center: "forest", illegalLocation: 0 },
    { corner: "forest", center: "village", illegalLocation: 1 },
  ],
  [
    { corner: "tundra", center: "lake", illegalLocation: 2 },
    { corner: "village", center: "lake", illegalLocation: 3 },
  ],
  [
    { corner: "village", center: "mountain", illegalLocation: 3 },
    { corner: "lake", center: "farm", illegalLocation: 0 },
  ],
];
// Each tile could be on either side so...
const TOTAL_SIDES_COMBINATIONS = 2 ** TILES.length;

export const ModularTiles = {
  tiles: TILES,

  encode(order: readonly number[], sides: readonly (0 | 1)[]): number {
    const orderStr = Vec.map(order, (idx) => idx.toString());
    const orderIdx =
      MathUtils.permutations_lazy_array(orderStr).indexOf(orderStr);

    const sidesStr = Vec.map(sides, (side) => (side === 0 ? "0" : "1")).join(
      ""
    );
    const sidesIdx = Number.parseInt(sidesStr, 2);

    return orderIdx * TOTAL_SIDES_COMBINATIONS + sidesIdx;
  },

  decode(
    idx: number
  ): readonly [order: readonly number[], sides: readonly (0 | 1)[]] {
    const orderIdx = Math.floor(idx / TOTAL_SIDES_COMBINATIONS);
    const idxStr = Vec.map(Vec.range(0, TILES.length - 1), (idx) =>
      idx.toString()
    );
    const orderStr = nullthrows(
      MathUtils.permutations_lazy_array(idxStr).at(orderIdx),
      `Idx ${orderIdx} is out of range`
    );
    const order = Vec.map(orderStr, (idxStr) => Number.parseInt(idxStr));

    const sidesIdx = idx % TOTAL_SIDES_COMBINATIONS;
    const sides = Vec.map(sidesIdx.toString(2).split(""), (digit) =>
      digit === "0" ? 0 : 1
    );

    return [order, sides];
  },
} as const;
