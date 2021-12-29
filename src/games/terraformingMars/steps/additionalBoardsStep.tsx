import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import coloniesVariant from "./coloniesVariant";
import venusVariant from "./venusVariant";

export default createDerivedGameStep({
  id: "additionalBoards",
  dependencies: [venusVariant, coloniesVariant],
  skip: ([isVenus, isColonies]) => !isVenus && !isColonies,
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [isVenus, isColonies],
}: DerivedStepInstanceComponentProps<boolean, boolean>): JSX.Element {
  return (
    <HeaderAndSteps synopsis="Place the following boards next to the game board:">
      {isVenus && (
        <>
          <strong>Venus</strong> board.
        </>
      )}
      {isColonies && (
        <>
          <strong>Trade Fleets</strong> tile.
        </>
      )}
    </HeaderAndSteps>
  );
}
