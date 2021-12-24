import { Typography } from "@mui/material";
import { PlayerAvatar } from "features/players/PlayerAvatar";
import { PlayerId } from "features/players/playersSlice";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { ChosenElement } from "games/core/ux/ChosenElement";
import firstPlayerStep from "./firstPlayerStep";

export default createDerivedGameStep({
  id: "firstPlayerMarker",
  dependencies: [firstPlayerStep],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [firstPlayerId],
}: DerivedStepInstanceComponentProps<PlayerId>): JSX.Element {
  return (
    <Typography variant="body1">
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
