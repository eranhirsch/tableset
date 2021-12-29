import { Typography } from "@mui/material";
import { PlayerId } from "features/players/playersSlice";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { playersMetaStep } from "games/global";
import preludeVariant from "./preludeVariant";

export default createDerivedGameStep({
  id: "researchPhase",
  dependencies: [playersMetaStep, preludeVariant],

  // This step is meaningless as it only prompts players to think what cards
  // they want, but not do anything about that yet. The next step is active. For
  // solo play the two steps could be merged.
  skip: ([playerIds]) => playerIds!.length === 1,

  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [_playerIds, isPrelude],
}: DerivedStepInstanceComponentProps<
  readonly PlayerId[],
  boolean
>): JSX.Element {
  return (
    <>
      <HeaderAndSteps synopsis={<>Players now simultaneously choose:</>}>
        <>
          <strong>1</strong> corporation.
        </>
        {isPrelude && (
          <>
            <strong>2</strong> prelude cards
            <em>; these don't cost anything to keep</em>.
          </>
        )}
        <>
          <em>Any number</em> of project cards to keep in their starting hand
          <em>; at a cost of 3M€ per card</em>.
        </>
      </HeaderAndSteps>
      <Typography variant="body2" textAlign="justify">
        <em>
          Players <strong>shouldn't</strong> reveal their selections yet! that
          is done in the next step.
        </em>
      </Typography>
    </>
  );
}
