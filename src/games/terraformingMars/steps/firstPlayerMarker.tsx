import { Typography } from "@mui/material";
import { PlayerAvatar } from "features/players/PlayerAvatar";
import { PlayerId } from "features/players/playersSlice";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { playersMetaStep } from "games/global";
import firstPlayerStep from "./firstPlayerStep";

export default createDerivedGameStep({
  id: "firstPlayerMarker",
  dependencies: [playersMetaStep, firstPlayerStep],
  skip: ([playerIds]) => playerIds!.length === 1,
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [_playerIds, firstPlayerId],
}: DerivedStepInstanceComponentProps<
  readonly PlayerId[],
  PlayerId
>): JSX.Element {
  return (
    <Typography variant="body1" textAlign="justify">
      Give{" "}
      {firstPlayerId != null ? (
        <PlayerAvatar playerId={firstPlayerId} inline />
      ) : (
        "the first player"
      )}{" "}
      the <ChosenElement extraInfo="marker">first player</ChosenElement>.
    </Typography>
  );
}
