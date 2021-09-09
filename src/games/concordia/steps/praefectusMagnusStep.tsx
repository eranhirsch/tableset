import { PlayerId } from "../../../features/players/playersSlice";
import createDerivedGameStep, {
  DerivedStepInstanceComponentProps,
} from "../../core/steps/createDerivedGameStep";
import createPlayersDependencyMetaStep from "../../core/steps/createPlayersDependencyMetaStep";
import firstPlayerStep from "../../global/steps/firstPlayerStep";
import playOrderStep from "../../global/steps/playOrderStep";
import Player from "../../global/ux/Player";

export default createDerivedGameStep({
  id: "praefectusMagnus",
  dependencies: [
    createPlayersDependencyMetaStep(),
    playOrderStep,
    firstPlayerStep,
  ],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [playerIds, playOrder, firstPlayerId],
}: DerivedStepInstanceComponentProps<
  readonly PlayerId[],
  readonly PlayerId[],
  PlayerId
>): JSX.Element | null {
  if (playerIds == null) {
    // We don't know who the players are so can't say anything
    return <div>No Players</div>;
  }

  if (playOrder == null) {
    if (firstPlayerId == null) {
      // we don't know anything
      return <div>no order or first player</div>;
    }

    // We at least know who the first player is
    return <div>first player known, not order</div>;
  } else if (firstPlayerId == null) {
    // play order known, but not first player
    return <div>No first player, but order known</div>;
  }

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
