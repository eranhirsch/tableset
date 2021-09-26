import { Typography } from "@mui/material";
import { Str } from "common";
import { PlayerAvatar } from "games/global/ux/PlayerAvatar";
import { PlayerId } from "../../../model/Player";
import createDerivedGameStep, {
  DerivedStepInstanceComponentProps,
} from "../../core/steps/createDerivedGameStep";
import createPlayersDependencyMetaStep from "../../core/steps/createPlayersDependencyMetaStep";
import firstPlayerStep from "../../global/steps/firstPlayerStep";
import playOrderStep from "../../global/steps/playOrderStep";

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
    return (
      <Typography variant="body1">
        Give the last player the <strong>Praefectus Magnus</strong> card.
      </Typography>
    );
  }

  if (firstPlayerId == null) {
    return (
      <Typography variant="body1">
        Give the {playerIds.length}
        {Str.number_suffix(playerIds.length)} player the{" "}
        <strong>Praefectus Magnus</strong> card.
      </Typography>
    );
  }

  if (playOrder == null) {
    return (
      <Typography variant="body1">
        Give the player sitting to the left of{" "}
        <PlayerAvatar playerId={firstPlayerId} inline /> the{" "}
        <strong>Praefectus Magnus</strong> card.
      </Typography>
    );
  }

  const fullPlayOrder = [playerIds[0], ...playOrder];
  const firstPlayerIdx = fullPlayOrder.findIndex(
    (playerId) => playerId === firstPlayerId
  );
  const lastPlayer =
    fullPlayOrder[
      (firstPlayerIdx > 0 ? firstPlayerIdx : fullPlayOrder.length) - 1
    ];

  return (
    <Typography variant="body1">
      Give <PlayerAvatar playerId={lastPlayer} inline /> the{" "}
      <strong>Praefectus Magnus</strong> card.
    </Typography>
  );
}
