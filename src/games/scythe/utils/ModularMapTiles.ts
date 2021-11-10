import { MathUtils, nullthrows, Num, Random, Vec } from "common";
import { HexType } from "./HexType";

interface TileSide {
  center: HexType;
  // Corner is the top left corner
  corner: HexType;
  // tile locations are 0-index from left to right and then top to bottom:
  //   0 1
  //   2 3
  illegalLocations: readonly number[];
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
    { corner: "village", center: "forest", illegalLocations: [1] },
    { corner: "tundra", center: "village", illegalLocations: [2] },
  ],
  [
    { corner: "tundra", center: "forest", illegalLocations: [0, 2] },
    { corner: "forest", center: "village", illegalLocations: [1, 3] },
  ],
  [
    { corner: "tundra", center: "lake", illegalLocations: [2] },
    { corner: "village", center: "lake", illegalLocations: [3] },
  ],
  [
    { corner: "village", center: "mountain", illegalLocations: [3] },
    { corner: "lake", center: "farm", illegalLocations: [0] },
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
    // We use the `!` because we just generated this idx, it's unlikely that the
    // result would be null unless we have a bug with the `common` library
    const order = ORDER_PERMUTATIONS.at(orderIdx)!;

    const legalSides = Vec.map(order, (tileIdxStr, position) =>
      Vec.maybe_map(
        TILES[Number.parseInt(tileIdxStr)],
        ({ illegalLocations }, sideIdx) =>
          illegalLocations.includes(position) ? undefined : sideIdx
      )
    );

    const sidesIdx = fromBinaryDigits(
      // We want to pick a side randomly from those sides that are legal in
      // this position (there would always be at least 1)
      Vec.map(legalSides, (sides) => Random.sample(sides, 1))
    );

    return Num.encode_base32(orderIdx * TOTAL_SIDES_COMBINATIONS + sidesIdx);
  },

  decode(hash: string): readonly TileSide[] {
    const idx = Num.decode_base32(hash);

    const orderIdx = Math.floor(idx / TOTAL_SIDES_COMBINATIONS);
    const orderStr = nullthrows(
      ORDER_PERMUTATIONS.at(orderIdx),
      `Idx ${orderIdx} is out of range`
    );
    const order = Vec.map(orderStr, (idxStr) => Number.parseInt(idxStr));

    const sides = asBinaryDigits(idx % TOTAL_SIDES_COMBINATIONS);

    return Vec.map(
      order,
      (tileIdx, position) => ModularMapTiles.tiles[tileIdx][sides[position]]
    );
  },
} as const;

// The result of the sample would always be either 0 or 1, we use that
// to encode the results as a binary number.
const fromBinaryDigits = (coefficients: readonly number[]): number =>
  MathUtils.sum(
    Vec.map(
      Vec.reverse(coefficients),
      (coefficient, order) => coefficient * 2 ** order
    )
  );

const asBinaryDigits = (x: number): readonly number[] =>
  Vec.map(x.toString(2).padStart(TILE_SLOTS, "0").split(""), (digit) =>
    Number.parseInt(digit)
  );