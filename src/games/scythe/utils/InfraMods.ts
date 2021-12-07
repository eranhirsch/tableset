import { $, MathUtils, nullthrows, Random, tuple, Vec } from "common";

const ALL_MODS = [
  // Spell-checker: disable
  "assemblyLine",
  "automachines",
  "cavalry",
  "construction",
  "machinery",
  "propaganda",
  "recruitmentOffice",
  "spy",
  // Spell-checker: enable
] as const;
type TileId = typeof ALL_MODS[number];

const MOD_COPIES = 4;

const MODS_PER_PLAYER = 4;

export const InfraMods = {
  randomIdx(playersCount: number): number {
    // Start with all tiles
    let availableTiles = allTiles();

    return Vec.map(Vec.range(1, playersCount), () => {
      // We use the combinations-array to map an index for the resulting
      // combination of abilities
      // IMPORTANT: This is done before we fetch the candidates because we need
      // the `availableTiles` to contain the tiles before we select them.
      const combsMapper = MathUtils.combinations_lazy_array(
        Vec.unique(availableTiles),
        MODS_PER_PLAYER
      );

      const selected = drawAbilities(availableTiles);

      // Remove the selected tiles from the available ones for the next faction
      availableTiles = Vec.diff(availableTiles, selected);

      return tuple(
        // The "digit" in our encoding
        combsMapper.indexOf(selected),
        // It's "radix" (which is the range of values for the digit, from 0 to
        // <radix>-1)
        combsMapper.length
      );
    }).reduceRight((idx, [digit, radix]) => idx * radix + digit, 0);
  },

  decode(idx: number, playerCount: number): readonly (readonly TileId[])[] {
    let availableTiles = allTiles();
    let ongoingIdx = idx;

    return Vec.map(Vec.range(1, playerCount), () => {
      // We use the combinations-array to map an index for the resulting
      // combination of abilities
      // IMPORTANT: This is done before we fetch the candidates because we need
      // the `availableTiles` to contain the tiles before we select them.
      const combsMapper = MathUtils.combinations_lazy_array(
        Vec.unique(availableTiles),
        MODS_PER_PLAYER
      );

      const selected = nullthrows(
        combsMapper.at(ongoingIdx % combsMapper.length),
        `Idx ${idx} caused an overflow error`
      );

      // Update the state for the computation by first removing the tiles just
      // used from those available (as was done when encoding)
      availableTiles = Vec.diff(availableTiles, selected);
      // ...and update the ongoing index by removing this part of the
      // computation from it.
      ongoingIdx = Math.floor(ongoingIdx / combsMapper.length);

      return selected;
    });
  },

  label,
} as const;

const allTiles = (): readonly TileId[] =>
  $(
    ALL_MODS,
    ($$) => Vec.map($$, (ability) => Vec.fill(MOD_COPIES, ability)),
    Vec.flatten
  );

const drawAbilities = (availableTiles: readonly TileId[]): readonly TileId[] =>
  Vec.range(1, MODS_PER_PLAYER).reduce((selected, _) => {
    let candidate: TileId;
    do {
      candidate = Random.sample_1(Vec.diff(availableTiles, selected))!;
    } while (selected.includes(candidate));
    return Vec.concat(selected, candidate);
  }, [] as readonly TileId[]);

function label(tileId: TileId): string {
  switch (tileId) {
    // Spell-checker: disable
    case "assemblyLine":
      return "Assembly Line";
    case "automachines":
      return "Automachines";
    case "cavalry":
      return "Cavalry";
    case "construction":
      return "Construction";
    case "machinery":
      return "Machinery";
    case "propaganda":
      return "Propaganda";
    case "recruitmentOffice":
      return "Recruitment Office";
    case "spy":
      return "Spy";
    // Spell-checker: enable
  }
}
