import { MathUtils, nullthrows, Num, Random, Vec } from "common";
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

/**
 * indexed by number of players, this array summarizes the recommended amount of
 * tiles to remove per each player count.
 */
const RECOMMENDED_REMOVE_AMOUNT_PER_PLAYER_COUNT = [
  undefined,
  undefined,
  3,
  2,
  1,
  0,
  0,
  0,
];

/**
 * We put exactly this number of tiles on the board.
 */
const TILE_SLOTS = 4;

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
const TOTAL_SIDES_COMBINATIONS = 2 ** TILE_SLOTS;

const ORDER_PERMUTATIONS = MathUtils.permutations_lazy_array(
  // This is just an array with: ["0", "1", "2", ...] because the permutations
  // array doesn't work neatly with: [0, 1, 2, ...]
  Vec.map(Vec.range(0, TILE_SLOTS - 1), (idx) => idx.toString())
);

export const ModularMapTiles = {
  tiles: TILES,

  MAX_IN_PLAY: TILE_SLOTS,

  inPlay: (playerCount: number) =>
    TILE_SLOTS - (RECOMMENDED_REMOVE_AMOUNT_PER_PLAYER_COUNT[playerCount] ?? 0),

  randomHash(): string {
    const orderIdx = Random.index(ORDER_PERMUTATIONS);

    const sidesIdx = Number.parseInt(
      // Going over the order we just picked, we need to pick a side for each
      // tile
      Vec.map(ORDER_PERMUTATIONS.at(orderIdx)!, (tileIdxStr, position) =>
        Random.sample(
          Vec.maybe_map(
            TILES[Number.parseInt(tileIdxStr)],
            ({ illegalLocation }, idx) =>
              illegalLocation === position ? undefined : idx
          ),
          1
        ).toString()
      ).join(""),
      2
    );

    return Num.encode_base32(orderIdx * TOTAL_SIDES_COMBINATIONS + sidesIdx);
  },

  decode(
    hash: string
  ): readonly [order: readonly number[], sides: readonly (0 | 1)[]] {
    debugger;
    const idx = Num.decode_base32(hash);

    const orderIdx = Math.floor(idx / TOTAL_SIDES_COMBINATIONS);
    const orderStr = nullthrows(
      ORDER_PERMUTATIONS.at(orderIdx),
      `Idx ${orderIdx} is out of range`
    );
    const order = Vec.map(orderStr, (idxStr) => Number.parseInt(idxStr));

    const sidesIdx = idx % TOTAL_SIDES_COMBINATIONS;
    const sides = Vec.map(
      sidesIdx.toString(2).padStart(TILE_SLOTS, "0").split(""),
      (digit) => (digit === "0" ? 0 : 1)
    );

    return [order, sides];
  },
} as const;
