import { MathUtils, nullthrows, Num, Random } from "common";

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

export default {
  randomHash: (playerCount: number): string =>
    Num.encode_base32(
      Random.index(
        MathUtils.combinations_lazy_array(
          FORUM_TILES.patrician.tiles,
          playerCount + 1
        )
      )
    ),

  decode: (
    playerCount: number,
    forumHash: string
  ): readonly typeof FORUM_TILES["patrician"]["tiles"][number][] =>
    nullthrows(
      MathUtils.combinations_lazy_array(
        FORUM_TILES.patrician.tiles,
        playerCount + 1
      ).at(Num.decode_base32(forumHash)),
      `Bad forum hash ${forumHash}`
    ),
} as const;
