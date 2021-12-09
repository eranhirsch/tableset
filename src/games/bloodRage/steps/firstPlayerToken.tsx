import { Typography } from "@mui/material";
import { PlayerAvatar } from "features/players/PlayerAvatar";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { PlayerId } from "model/Player";
import firstPlayerStep from "./firstPlayerStep";

export default createDerivedGameStep({
  id: "firstPlayerToken",
  dependencies: [firstPlayerStep],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [firstPlayerId],
}: DerivedStepInstanceComponentProps<PlayerId>): JSX.Element {
  return (
    <Typography variant="body1">
      Give{" "}
      {firstPlayerId == null ? (
        "the first player"
      ) : (
        <PlayerAvatar playerId={firstPlayerId} inline />
      )}{" "}
      the <ChosenElement>First Player token</ChosenElement>.{" "}
      <em>
        The First Player token will be passed to the player to the left at the
        end of each Age
      </em>
      .
    </Typography>
  );
}
