import { Typography } from "@mui/material";
import { PlayerId } from "features/players/playersSlice";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { playersMetaStep } from "games/global";

export default createDerivedGameStep({
  id: "startTheGame",
  dependencies: [playersMetaStep],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [playerIds],
}: DerivedStepInstanceComponentProps<readonly PlayerId[]>): JSX.Element {
  const isSolo = playerIds!.length === 1;
  return (
    <Typography variant="body1" textAlign="justify">
      The first generation starts{" "}
      {!isSolo && (
        <>
          without a <em>player order</em> phase and{" "}
        </>
      )}
      without a <em>research</em> phase{" "}
      <em>
        (since you just performed {isSolo ? "it" : "those phases"} during setup)
      </em>
      , so {isSolo ? "start" : "the first player just starts"} the action phase.
    </Typography>
  );
}
