import { Typography } from "@mui/material";
import { PlayerId } from "features/players/playersSlice";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { playersMetaStep } from "games/global";

export default createDerivedGameStep({
  id: "researchPhase",
  dependencies: [playersMetaStep],

  // This step is meaningless as it only prompts players to think what cards
  // they want, but not do anything about that yet. The next step is active. For
  // solo play the two steps could be merged.
  skip: ([playerIds]) => playerIds!.length === 1,

  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [_playerIds],
}: DerivedStepInstanceComponentProps<readonly PlayerId[]>): JSX.Element {
  return (
    <>
      <Typography variant="body1" textAlign="justify">
        Players now simultaneously choose which corporation to play, and what
        project cards to keep in their starting hand.
      </Typography>
      <Typography variant="body2" textAlign="justify">
        <em>
          players shouldn't reveal their selections yet, that is done in the
          next step.
        </em>
      </Typography>
    </>
  );
}
