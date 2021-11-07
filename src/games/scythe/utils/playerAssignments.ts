import { Dict, invariant, MathUtils, nullthrows, Vec } from "common";
import { PlayerId } from "model/Player";
import { ScytheProductId } from "../ScytheProductId";
import { Faction, FactionId, Factions } from "./Factions";
import { Mat, PlayerMats } from "./PlayerMats";

export function playerAssignments(
  playerAssignmentIdx: number,
  playerMatsIdx: number | null | undefined,
  factionIds: readonly FactionId[] | null | undefined,
  playerIds: readonly PlayerId[],
  productIds: readonly ScytheProductId[]
): Readonly<
  Record<
    PlayerId,
    readonly [faction: Readonly<Faction> | null, mat: Readonly<Mat> | null]
  >
> {
  invariant(
    factionIds != null || playerMatsIdx != null,
    `Can't compute player assignments when both factions and player mats are missing`
  );

  const playerMatIds =
    playerMatsIdx == null
      ? null
      : PlayerMats.decode(
          playerMatsIdx,
          playerIds.length,
          factionIds != null,
          productIds
        );

  invariant(
    factionIds == null || factionIds.length === playerIds.length,
    `Not enough factions: ${JSON.stringify(factionIds)}, expected ${
      playerIds.length
    }`
  );

  invariant(
    playerMatIds == null || playerMatIds.length === playerIds.length,
    `Not enough player mats: ${JSON.stringify(playerMatIds)}, expected ${
      playerIds.length
    }`
  );

  return Dict.associate(
    nullthrows(
      MathUtils.permutations_lazy_array(playerIds).at(playerAssignmentIdx),
      `Idx ${playerAssignmentIdx} overflow for players ${playerIds}`
    ),
    // Create tuples of factions and mats
    Vec.zip(
      factionIds != null
        ? Vec.map(factionIds, (fid) => Factions[fid])
        : Vec.fill(playerIds.length, null),
      playerMatIds != null
        ? Vec.map(playerMatIds, (mid) => PlayerMats[mid])
        : Vec.fill(playerIds.length, null)
    )
  );
}
