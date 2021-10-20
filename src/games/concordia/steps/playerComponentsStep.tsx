import { createDerivedGameStep } from "games/core/steps/createDerivedGameStep";
import React from "react";
import { HeaderAndSteps } from "../../core/ux/HeaderAndSteps";

export default createDerivedGameStep({
  id: "playerComponents",
  dependencies: [],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent(): JSX.Element {
  return (
    <HeaderAndSteps synopsis="Each player takes all player components in their color:">
      <>
        A <strong>storehouse</strong> board, placing it in front of them.
      </>
      <>
        6 wooden <strong>colonist</strong> meeples: 3 <strong>land</strong>{" "}
        colonists, and 3 <strong>sea</strong> colonists, placing them in the
        storehouse, each in it's own cell.
      </>
      <>
        15 wooden <strong>houses</strong>, placing them near (but not{" "}
        <em>IN</em>) the storehouse.
      </>
      <>
        A wooden <strong>scoring marker</strong> disc, placing it on the board's
        score track, on the 0 score space.
      </>
      <>
        A <strong>player aid</strong> card.
      </>
    </HeaderAndSteps>
  );
}
