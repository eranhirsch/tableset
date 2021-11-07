import { Dict, invariant, Vec } from "common";
import { PlayerId } from "model/Player";
import { ScytheProductId } from "../ScytheProductId";
import { Faction, FactionId, Factions } from "./Factions";
import { Mat, PlayerMats } from "./PlayerMats";

export function playerAssignments(
  order: readonly PlayerId[],
  playerMatsHash: string | null | undefined,
  factionIds: readonly FactionId[] | null | undefined,
  productIds: readonly ScytheProductId[]
): Readonly<
  Record<
    PlayerId,
    readonly [faction: Readonly<Faction> | null, mat: Readonly<Mat> | null]
  >
> {
  invariant(
    factionIds != null || playerMatsHash != null,
    `Can't compute player assignments when both factions and player mats are missing`
  );

  const playerMatIds =
    playerMatsHash == null
      ? null
      : PlayerMats.decode(
          playerMatsHash,
          order.length,
          factionIds != null,
          productIds
        );

  invariant(
    factionIds == null || factionIds.length === order.length,
    `Not enough factions: ${JSON.stringify(factionIds)}, expected ${
      order.length
    }`
  );

  invariant(
    playerMatIds == null || playerMatIds.length === order.length,
    `Not enough player mats: ${JSON.stringify(playerMatIds)}, expected ${
      order.length
    }`
  );

  return Dict.associate(
    order,
    // Create tuples of factions and mats
    Vec.zip(
      factionIds != null
        ? Vec.map(factionIds, (fid) => Factions[fid])
        : Vec.fill(order.length, null),
      playerMatIds != null
        ? Vec.map(playerMatIds, (mid) => PlayerMats[mid])
        : Vec.fill(order.length, null)
    )
  );
}
