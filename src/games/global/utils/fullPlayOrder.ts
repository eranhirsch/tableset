import { Vec } from "common";
import { PlayerId } from "model/Player";

/**
 * Utility method to find the complete order of play from the list of players,
 * the first player, and the play order (each of which only provide a partial
 * part of the full picture on it's own)
 *
 * @param playerIds - the result of resolving the playersMetaStep or fetching it
 * directly from the slice.
 * @param playOrder - the result of the playOrderStep.
 * @param firstPlayerId - the result of the firstPlayerStep.
 * @returns a full order of player ids where index 0 is the first player.
 */
export function fullPlayOrder(
  playerIds: readonly PlayerId[],
  playOrder: readonly PlayerId[],
  firstPlayerId: PlayerId
): readonly PlayerId[] {
  debugger;
  const fullPlayOrder = Vec.concat(Vec.take(playerIds, 1), playOrder);
  const firstPlayerIdx = fullPlayOrder.findIndex(
    (playerId) => playerId === firstPlayerId
  );
  return Vec.rotate(fullPlayOrder, -firstPlayerIdx);
}
