import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import coloniesVariant from "./coloniesVariant";
import turmoilVariant from "./turmoilVariant";
import venusVariant from "./venusVariant";

export default createDerivedGameStep({
  id: "additionalBoards",
  dependencies: [venusVariant, coloniesVariant, turmoilVariant],
  skip: ([isVenus, isColonies, isTurmoil]) =>
    !isVenus && !isColonies && !isTurmoil,
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [isVenus, isColonies, isTurmoil],
}: DerivedStepInstanceComponentProps<boolean, boolean, boolean>): JSX.Element {
  return (
    <HeaderAndSteps synopsis="Place the following boards next to the game board:">
      {isVenus && (
        <>
          Venus Next: <strong>Venus</strong> board.
        </>
      )}
      {isColonies && (
        <>
          Colonies: <strong>Trade Fleets</strong> tile.
        </>
      )}
      {isTurmoil && (
        <>
          Turmoil: <strong>Terraforming Committee</strong> board.
        </>
      )}
      {isTurmoil && (
        <>
          Turmoil: <strong>Global Event</strong> board.
        </>
      )}
    </HeaderAndSteps>
  );
}
