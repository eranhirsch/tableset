import { Avatar } from "@material-ui/core";
import { useAppEntityIdSelectorEnforce } from "../../../common/hooks/useAppEntityIdSelector";
import short_name from "../../../common/short_name";
import {
  PlayerId,
  playersSelectors,
} from "../../../features/players/playersSlice";
import createComputedGameStep from "../../core/steps/createComputedGameStep";
import firstPlayerStep from "../../global/steps/firstPlayerStep";
import playOrderStep from "../../global/steps/playOrderStep";

function Player({ playerId }: { playerId: PlayerId }) {
  const player = useAppEntityIdSelectorEnforce(playersSelectors, playerId);
  return <Avatar>{short_name(player.name)}</Avatar>;
}

export default createComputedGameStep({
  id: "praefectusMagnus",

  dependencies: [playOrderStep, firstPlayerStep],

  renderComputed: ({ playerIds }, playOrder, firstPlayer) => (
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
