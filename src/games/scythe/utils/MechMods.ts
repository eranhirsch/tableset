import { $, MathUtils, nullthrows, Random, tuple, Vec } from "common";
import { CombinationsLazyArray } from "common/standard_library/math/combinationsLazyArray";
import { FactionId } from "./Factions";

const FACTION_ABILITIES = [
  // spell-checker: disable
  "artillery",
  "camaraderie",
  "scout",
  "suiton",
  "sword",
  "township",
  "underpass",
] as const;

const FACTION_ABILITY: Readonly<
  Partial<Record<FactionId, typeof FACTION_ABILITIES[number]>>
> = {
  nordic: "artillery",
  polania: "camaraderie",
  crimea: "scout",
  togawa: "suiton",
  albion: "sword",
  rusviet: "township",
  saxony: "underpass",
};

const NEW_ABILITIES = [
  "armor",
  "entrenched",
  "feint",
  "foothold",
  "pontoons",
  "regroup",
  "reinforce",
  "stealth",
  "tactics",
  // spell-checker: enable
] as const;

type TileId = typeof NEW_ABILITIES[number] | typeof FACTION_ABILITIES[number];

const ABILITIES_PER_PLAYER = 4;

export const MechMods = {
  randomIdx(factionIds: readonly FactionId[]): number {
    // Start with all tiles
    let availableTiles = allTiles();

    return Vec.map(factionIds, (factionId) => {
      // Each of the base factions has one ability from the mech mods which they
      // already have on their faction board. We don't include this ability when
      // drawing tiles.
      const factionAbility = FACTION_ABILITY[factionId];

      // We use the combinations-array to map an index for the resulting
      // combination of abilities
      // IMPORTANT: This is done before we fetch the candidates because we need
      // the `availableTiles` to contain the tiles before we select them.
      const combsMapper = encoder(availableTiles, factionAbility);

      const selected = drawAbilities(availableTiles, factionAbility);

      // Remove the selected tiles from the available ones for the next faction
      availableTiles = Vec.diff(availableTiles, selected);

      console.log(factionId, selected);

      return tuple(
        // The "digit" in our encoding
        combsMapper.indexOf(selected),
        // It's "radix" (which is the range of values for the digit, from 0 to
        // <radix>-1)
        combsMapper.length
      );
    }).reduceRight((idx, [digit, radix]) => idx * radix + digit, 0);
  },

  decode(
    idx: number,
    factionIds: readonly FactionId[]
  ): readonly (readonly TileId[])[] {
    let availableTiles = allTiles();
    let ongoingIdx = idx;

    return Vec.map(factionIds, (factionId) => {
      const factionAbility = FACTION_ABILITY[factionId];

      const combsMapper = encoder(availableTiles, factionAbility);

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

const allTiles = () =>
  $(
    // There are 2 copies of each faction-specific ability
    Vec.map(FACTION_ABILITIES, (ability) => Vec.fill(2, ability as TileId)),
    ($$) =>
      Vec.concat(
        $$,
        // There are 3 copies of each mech-mod only ability
        Vec.map(NEW_ABILITIES, (ability) => Vec.fill(3, ability as TileId))
      ),
    Vec.flatten,
    Vec.sort
  );

/**
 * We use the combinations-array to map an index for the resulting combination
 * of abilities.
 *
 * IMPORTANT: This is done before we fetch the candidates because we need the
 * `availableTiles` to contain the tiles before we select them.
 */
const encoder = (
  availableTiles: readonly TileId[],
  factionAbility: TileId | undefined
): CombinationsLazyArray<TileId> =>
  $(
    availableTiles,
    Vec.unique,
    ($$) => Vec.diff($$, [factionAbility]),
    ($$) => MathUtils.combinations_lazy_array($$, ABILITIES_PER_PLAYER)
  );

const drawAbilities = (
  availableTiles: readonly TileId[],
  factionAbility: TileId | undefined
): readonly TileId[] =>
  Vec.range(1, ABILITIES_PER_PLAYER).reduce((selected, _) => {
    let candidate: TileId;
    do {
      candidate = Random.sample_1(Vec.diff(availableTiles, selected))!;
    } while (selected.includes(candidate) || candidate === factionAbility);
    return Vec.concat(selected, candidate);
  }, [] as readonly TileId[]);

function label(tileId: TileId): string {
  switch (tileId) {
    // Spell-checker: disable
    case "armor":
      return "Armor";
    case "artillery":
      return "Artillery";
    case "camaraderie":
      return "Camaraderie";
    case "entrenched":
      return "Entrenched";
    case "feint":
      return "Feint";
    case "foothold":
      return "Foothold";
    case "pontoons":
      return "Pontoons";
    case "regroup":
      return "Regroup";
    case "reinforce":
      return "Reinforce";
    case "scout":
      return "Scout";
    case "stealth":
      return "Stealth";
    case "suiton":
      return "Suiton";
    case "sword":
      return "Sword";
    case "tactics":
      return "Tactics";
    case "township":
      return "Township";
    case "underpass":
      return "Underpass";
    // Spell-checker: enable
  }
}