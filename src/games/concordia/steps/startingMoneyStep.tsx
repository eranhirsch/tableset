import React from "react";
import { PlayerId } from "../../../features/players/playersSlice";
import createDerivedGameStep from "../../core/steps/createDerivedGameStep";
import firstPlayerStep from "../../global/steps/firstPlayerStep";
import playOrderStep from "../../global/steps/playOrderStep";
import StartingMoney from "../ux/StartingMoney";

export default createDerivedGameStep({
  id: "startingMoney",

  dependencies: [playOrderStep, firstPlayerStep],

  renderDerived: ({ playerIds }, playOrder, firstPlayer) => (
    <StartingMoney order={reordered(playerIds, playOrder, firstPlayer)} />
  ),
});

function reordered(
  playerIds: readonly PlayerId[],
  playOrder: readonly PlayerId[],
  firstPlayerId: PlayerId
): readonly PlayerId[] {
  const fullPlayOrder = [playerIds[0], ...playOrder];
  const firstPlayerIdx = fullPlayOrder.findIndex(
    (playerId) => playerId === firstPlayerId
  );
  return fullPlayOrder
    .slice(firstPlayerIdx)
    .concat(fullPlayOrder.slice(0, firstPlayerIdx));
}
