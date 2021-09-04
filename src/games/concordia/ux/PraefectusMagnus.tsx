import { PlayerId } from "../../../features/players/playersSlice";
import { DerivedStepInstanceComponentProps } from "../../core/steps/createDerivedGameStep";
import Player from "../../global/ux/Player";

export default function PraefectusMagnus({
  context: { playerIds },
  dependencies: [playOrder, firstPlayerId],
}: DerivedStepInstanceComponentProps<readonly PlayerId[], PlayerId>) {
  const fullPlayOrder = [playerIds[0], ...playOrder];
  const firstPlayerIdx = fullPlayOrder.findIndex(
    (playerId) => playerId === firstPlayerId
  );
  const lastPlayer =
    fullPlayOrder[
      (firstPlayerIdx > 0 ? firstPlayerIdx : fullPlayOrder.length) - 1
    ];

  return <Player playerId={lastPlayer} />;
}
