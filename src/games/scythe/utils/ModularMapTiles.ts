import {
  invariant_violation,
  MathUtils,
  nullthrows,
  Random,
  Vec,
} from "common";
import { HexType } from "./HexType";

type TileSide = [
  top: [left: HexType, right: HexType],
  middle: [left: HexType, center: HexType, right: HexType],
  bottom: [left: HexType, right: HexType]
];

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
  // Tile 0
  [
    [
      ["village", "lake"],
      ["mountain", "forest", "village"],
      ["farm", "tundra"],
    ],
    [
      ["tundra", "farm"],
      ["forest", "village", "village"],
      ["lake", "mountain"],
    ],
  ],
  // Tile 1
  [
    [
      ["tundra", "village"],
      ["lake", "forest", "mountain"],
      ["tundra", "farm"],
    ],
    [
      ["forest", "farm"],
      ["mountain", "village", "lake"],
      ["tundra", "mountain"],
    ],
  ],
  // Tile 2
  [
    [
      ["tundra", "village"],
      ["farm", "lake", "mountain"],
      ["lake", "forest"],
    ],
    [
      ["village", "forest"],
      ["tundra", "lake", "mountain"],
      ["farm", "lake"],
    ],
  ],
  // Tile 3
  [
    [
      ["village", "tundra"],
      ["forest", "mountain", "village"],
      ["farm", "lake"],
    ],
    [
      ["lake", "tundra"],
      ["forest", "farm", "village"],
      ["village", "mountain"],
    ],
  ],
];

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

  randomIdx(): number {
    while (true) {
      const orderIdx = Random.index(ORDER_PERMUTATIONS);
      const sidesIdx = Random.int(0, TOTAL_SIDES_COMBINATIONS);

      const tiles = Vec.map(
        Vec.zip(reorderTilesByIdx(orderIdx), asBinaryDigits(sidesIdx)),
        ([tiles, side]) => tiles[side]
      );
      const lakesOnHomeBases = tiles.some((tile, position) =>
        adjacentToHomeBase(tile, homeBaseIdxAtTile(position))!.includes("lake")
      );
      if (!lakesOnHomeBases) {
        const idx = orderIdx * TOTAL_SIDES_COMBINATIONS + sidesIdx;
        return idx;
      }
    }
  },

  decode(idx: number): readonly TileSide[] {
    const orderIdx = Math.floor(idx / TOTAL_SIDES_COMBINATIONS);
    const reorderedTiles = reorderTilesByIdx(orderIdx);

    const sidesIdx = idx % TOTAL_SIDES_COMBINATIONS;
    const sides = asBinaryDigits(sidesIdx);

    return Vec.map(
      Vec.zip(reorderedTiles, sides),
      ([tile, side]) => tile[side]
    );
  },

  homeBaseIdxAtTile,
  tileIdxAtHomeBase,
  adjacentToHomeBase,
} as const;

const reorderTilesByIdx = (idx: number): typeof TILES =>
  Vec.map(
    nullthrows(ORDER_PERMUTATIONS.at(idx), `Idx ${idx} is out of range`),
    (idxStr) => TILES[Number.parseInt(idxStr)]
  );

/**
 * What a mess, home bases are ordered in clockwise order around the board but
 * our map tiles are ordered in reading order (left to right, top to bottom) so
 * we have this ugly conversion to do.
 */
function homeBaseIdxAtTile(tileIdx: number): number {
  switch (tileIdx) {
    case 0:
      // The upper left tile:
      // This is the last home base because it's exactly 1 counter-clockwise of
      // the home base location we start at (the top one) and we go clockwise.
      return 7;
    case 1:
      // The upper right tile
      return 1;
    case 2:
      // The lower left tile:
      // Notice that although home bases go in clockwise, tiles go in reading
      // order, so this home base is "out of order" from the home base for tile
      // 1 and 3
      return 5;
    case 3:
      // The lower right tile
      return 3;
    default:
      invariant_violation(`Unexpected tileIdx ${tileIdx}`);
  }
}

/**
 * What a mess, home bases are ordered in clockwise order around the board but
 * our map tiles are ordered in reading order (left to right, top to bottom) so
 * we have this ugly conversion to do.
 */
function tileIdxAtHomeBase(homeBaseIdx: number): number | undefined {
  switch (homeBaseIdx) {
    case 1:
      return 1;
    case 3:
      return 3;
    case 5:
      return 2;
    case 7:
      return 0;
    default:
      // Other home bases are on the board itself and not on the tiles
      return;
  }
}

/**
 * The home bases array starts at the top of the map and goes in clockwise
 */
function adjacentToHomeBase(
  [[topLeft, topRight], [left, _, right], [bottomLeft, bottomRight]]: TileSide,
  homeBaseIdx: number
): [HexType, HexType] | undefined {
  switch (homeBaseIdx) {
    case 1:
      return [topRight, right];
    case 3:
      return [right, bottomRight];
    case 5:
      return [left, bottomLeft];
    case 7:
      return [topLeft, left];
  }
}

const asBinaryDigits = (x: number): readonly number[] =>
  Vec.map(x.toString(2).padStart(TILE_SLOTS, "0").split(""), (digit) =>
    Number.parseInt(digit)
  );
