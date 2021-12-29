import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import trSoloVariant, { TR_GOAL } from "./trSoloVariant";
import venusVariant from "./venusVariant";

export default createDerivedGameStep({
  id: "markers",
  dependencies: [venusVariant, trSoloVariant],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [isVenus, isTrSolo],
}: DerivedStepInstanceComponentProps<boolean, boolean>): JSX.Element {
  return (
    <HeaderAndSteps
      synopsis={
        <>
          Place the white{" "}
          <ChosenElement extraInfo="cubes">marker</ChosenElement> (plastic) on
          their starting locations:
        </>
      }
    >
      <>
        The <ChosenElement extraInfo="marker">temperature</ChosenElement> on{" "}
        <strong>-30{"\u00b0"}C</strong>.
      </>
      <>
        The <ChosenElement extraInfo="marker">oxygen</ChosenElement> on{" "}
        <strong>0%</strong>.
      </>
      {isVenus && (
        <>
          The <ChosenElement extraInfo="marker">venus</ChosenElement> on{" "}
          <strong>0%</strong> at the start of the <em>venus scale</em>.
        </>
      )}
      <>
        The <ChosenElement extraInfo="marker">generation</ChosenElement> on{" "}
        <strong>1</strong> on the <em>TR track</em>.
      </>
      {isTrSolo && (
        <>
          A gold (resource) cube on <strong>{TR_GOAL}</strong> on the{" "}
          <em>TR track</em> to mark the TR goal for this game.
        </>
      )}
    </HeaderAndSteps>
  );
}
