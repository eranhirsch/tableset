import { Dict, invariant, tuple, Vec } from "common";
import { PlayerId } from "model/Player";
import { ScytheProductId } from "../ScytheProductId";
import { Faction, FactionId, Factions } from "./Factions";
import { Mat, MatId, PlayerMats } from "./PlayerMats";

export const playerAssignments = (
  order: readonly PlayerId[],
  playerMatsHash: string | null | undefined,
  factionIds: readonly FactionId[] | null | undefined,
  productIds: readonly ScytheProductId[]
): Readonly<
  Record<
    PlayerId,
    readonly [faction: Readonly<Faction> | null, mat: Readonly<Mat> | null]
  >
> =>
  Dict.map(
    playerAssignmentIds(order, playerMatsHash, factionIds, productIds),
    ([factionId, matId]) =>
      tuple(
        factionId != null ? Factions[factionId] : null,
        matId != null ? PlayerMats[matId] : null
      )
  );

export const playerAssignmentIds = (
  order: readonly PlayerId[],
  playerMatsHash: string | null | undefined,
  factionIds: readonly FactionId[] | null | undefined,
  productIds: readonly ScytheProductId[]
): Readonly<
  Record<PlayerId, readonly [faction: FactionId | null, mat: MatId | null]>
> =>
  Dict.associate(
    order,
    factionPlayerMatIdPairs(
      order.length,
      playerMatsHash,
      factionIds,
      productIds
    )
  );

export const factionPlayerMatPairs = (
  playersCount: number,
  playerMatsHash: string | null | undefined,
  factionIds: readonly FactionId[] | null | undefined,
  productIds: readonly ScytheProductId[]
): readonly (readonly [
  faction: Readonly<Faction> | null,
  mat: Readonly<Mat> | null
])[] =>
  Vec.map(
    factionPlayerMatIdPairs(
      playersCount,
      playerMatsHash,
      factionIds,
      productIds
    ),
    ([fid, mid]) =>
      tuple(
        fid != null ? Factions[fid] : null,
        mid != null ? PlayerMats[mid] : null
      )
  );

export function factionPlayerMatIdPairs(
  playersCount: number,
  playerMatsHash: string | null | undefined,
  factionIds: readonly FactionId[] | null | undefined,
  productIds: readonly ScytheProductId[]
): readonly (readonly [faction: FactionId | null, mat: MatId | null])[] {
  invariant(
    factionIds != null || playerMatsHash != null,
    `Can't compute player assignments when both factions and player mats are missing`
  );

  invariant(
    factionIds == null || factionIds.length === playersCount,
    `Not enough factions: ${JSON.stringify(
      factionIds
    )}, expected ${playersCount}`
  );

  const matIds =
    playerMatsHash == null
      ? null
      : PlayerMats.decode(
          playerMatsHash,
          playersCount,
          factionIds != null,
          productIds
        );

  invariant(
    matIds == null || matIds.length === playersCount,
    `Not enough mats: ${JSON.stringify(matIds)}, expected ${playersCount}`
  );

  return Vec.zip(
    factionIds ?? Vec.fill(playersCount, null),
    matIds ?? Vec.fill(playersCount, null)
  );
}

