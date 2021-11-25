import { $, MathUtils, Random } from "common";

export const FORUM_TILES = {
  citizen: {
    color: "green",
    tiles: [
      /* spell-checker: disable */
      "Augustus",
      "Commodus",
      "Julius",
      "Laurentius",
      "Mamercus",
      "Mamilius",
      "Marcus",
      "Novius",
      "Numerius",
      "Publius",
      "Quintus",
      "Spurius",
      "Tiberius",
      "Victoria",
      /* spell-checker: enable */
    ],
  },
  patrician: {
    color: "blue",
    tiles: [
      /* spell-checker: disable */
      "Annaeus Arcadius",
      "Appius Arcadius",
      "Aulus Arcadius",
      "Claudia Agrippina",
      "Claudius Pompeius",
      "Cornelius Scipio",
      "Donatus Pompeius",
      "Faustus Marcellus",
      "Gaius Marcellus",
      "Lucius Flavius",
      "Servius Marcellus",
      "Sextus Pompeius",
      "Titus Valerius",
      /* spell-checker: enable */
    ],
  },
} as const;

export const ForumTiles = {
  randomIndex: (playerCount: number): number =>
    $(
      FORUM_TILES.patrician.tiles,
      ($$) => MathUtils.combinations_lazy_array($$, playerCount + 1),
      ($$) => Random.index($$)
    ),

  decode: (
    index: number,
    playerCount: number
  ): readonly typeof FORUM_TILES["patrician"]["tiles"][number][] =>
    $(
      FORUM_TILES.patrician.tiles,
      ($$) => MathUtils.combinations_lazy_array($$, playerCount + 1),
      ($$) => $$.at(index),
      $.nullthrows(`Bad forum index ${index}`)
    ),
} as const;
