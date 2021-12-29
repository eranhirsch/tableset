import { Typography } from "@mui/material";
import { PlayerId } from "features/players/playersSlice";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { playersMetaStep } from "games/global";

export default createDerivedGameStep({
  id: "startingConditions",
  dependencies: [playersMetaStep],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [playerIds],
}: DerivedStepInstanceComponentProps<readonly PlayerId[]>): JSX.Element {
  const isSolo = playerIds!.length === 1;

  return (
    <>
      <HeaderAndSteps
        synopsis={isSolo ? undefined : "In player order, each player:"}
      >
        <>
          {isSolo
            ? "Pick a corporation to play"
            : "Reveals which corporation they will play"}
          <em>; put the other corporation back in the box</em>.
        </>
        <>
          Take any starting resources and production stated on the corporation
          card.
        </>
        <>
          Discard (to {isSolo ? "the" : "a common"} discard pile) any project
          cards {isSolo ? "you" : "they"} don't want to keep
          {isSolo ? "." : <em>; cards are always discarded face down!</em>}
        </>
        <>
          Pay <strong>3M€</strong> for each project card{" "}
          {isSolo ? "you" : "they"} keep.
        </>
      </HeaderAndSteps>
      <Typography variant="body2">
        <em>
          Be aware that your resources for the following few generations will be
          quite limited until you get your economy going.
        </em>
      </Typography>
    </>
  );
}
