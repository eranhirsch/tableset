import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import React from "react";
import { HeaderAndSteps } from "../../core/ux/HeaderAndSteps";
import fishMarketVariant from "./fishMarketVariant";

export default createDerivedGameStep({
  id: "playerComponents",
  dependencies: [fishMarketVariant],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [withFish],
}: DerivedStepInstanceComponentProps<boolean>): JSX.Element {
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
        A wooden <strong>scoring marker</strong> disc,{" "}
        {withFish ? (
          <>
            placing it near (but not <em>IN</em>) the storehouse
          </>
        ) : (
          "placing it on the 0 score space of the board's score track"
        )}
        .
      </>
      <>
        A <strong>player aid</strong> card.
      </>
    </HeaderAndSteps>
  );
}
