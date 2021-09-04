import { PlayerId } from "../../../features/players/playersSlice";
import createDerivedGameStep from "../../core/steps/createDerivedGameStep";
import firstPlayerStep from "../../global/steps/firstPlayerStep";
import playOrderStep from "../../global/steps/playOrderStep";
import Player from "../ux/Player";

export default createDerivedGameStep({
  id: "praefectusMagnus",

  dependencies: [playOrderStep, firstPlayerStep],

  renderDerived: ({ playerIds }, playOrder, firstPlayer) => (
    <Player playerId={lastPlayer(playerIds, playOrder, firstPlayer)} />
  ),
});

function lastPlayer(
  playerIds: readonly PlayerId[],
  playOrder: readonly PlayerId[],
  firstPlayerId: PlayerId
): PlayerId {
  const fullPlayOrder = [playerIds[0], ...playOrder];
  const firstPlayerIdx = fullPlayOrder.findIndex(
    (playerId) => playerId === firstPlayerId
  );
  return fullPlayOrder[
    (firstPlayerIdx > 0 ? firstPlayerIdx : fullPlayOrder.length) - 1
  ];
}
