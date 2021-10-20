import { Typography } from "@mui/material";
import { Str } from "common";
import { PlayerAvatar } from "features/players/PlayerAvatar";
import { playersMetaStep } from "games/core/steps/createPlayersDependencyMetaStep";
import { firstPlayerStep, playOrderStep } from "games/global";
import { PlayerId } from "../../../model/Player";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "../../core/steps/createDerivedGameStep";
import RomanTitle from "../ux/RomanTitle";
import fishMarketVariant from "./fishMarketVariant";

export default createDerivedGameStep({
  id: "praefectusMagnus",
  dependencies: [
    playersMetaStep,
    playOrderStep,
    firstPlayerStep,
    fishMarketVariant,
  ],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [playerIds, playOrder, firstPlayerId, withFish],
}: DerivedStepInstanceComponentProps<
  readonly PlayerId[],
  readonly PlayerId[],
  PlayerId,
  boolean
>): JSX.Element {
  const magnusLabel = (
    <strong>
      <RomanTitle>
        {/* spell-checker: disable */}
        Praefectvs {withFish ? "Piscatvs" : "Magnvs"}
        {/* spell-checker: enable */}
      </RomanTitle>
    </strong>
  );
  /* spell-checker: enable */

  if (playerIds == null) {
    return (
      <Typography variant="body1">
        Give the last player the {magnusLabel} card.
      </Typography>
    );
  }

  if (firstPlayerId == null) {
    return (
      <Typography variant="body1">
        Give the {playerIds.length}
        {Str.number_suffix(playerIds.length)} player the {magnusLabel} card.
      </Typography>
    );
  }

  if (playOrder == null) {
    return (
      <Typography variant="body1">
        Give the player sitting to the left of{" "}
        <PlayerAvatar playerId={firstPlayerId} inline /> the {magnusLabel} card.
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
      Give <PlayerAvatar playerId={lastPlayer} inline /> the {magnusLabel} card.
    </Typography>
  );
}
