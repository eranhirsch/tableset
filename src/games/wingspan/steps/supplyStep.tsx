import { PlayerId } from "features/players/playersSlice";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { playersMetaStep } from "games/global";

export default createDerivedGameStep({
  id: "supply",
  dependencies: [playersMetaStep],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [playerIds],
}: DerivedStepInstanceComponentProps<readonly PlayerId[]>): JSX.Element {
  return (
    <>
      Place all food and egg tokens in the supply
      {playerIds!.length > 1 && (
        <>
          . <em> These are tokens accessible to all players</em>
        </>
      )}
      .
    </>
  );
}
