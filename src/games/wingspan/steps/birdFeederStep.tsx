import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { Food } from "../utils/Food";
import oceaniaBirdsVariant from "./oceaniaBirdsVariant";
import productsMetaStep, { WingspanProductId } from "./productsMetaStep";

const NUM_DICE = 5;

export default createDerivedGameStep({
  // TODO: This step could be randomized as the results are random, but it
  // might be too pedantic as it has marginal impact on game and and the
  // cost to build it properly would be too high.
  id: "birdFeeder",
  dependencies: [productsMetaStep, oceaniaBirdsVariant],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [productIds, isOceania],
}: DerivedStepInstanceComponentProps<
  readonly WingspanProductId[],
  boolean
>): JSX.Element {
  const isMultiDiceSets = productIds!.includes("oceania");
  return (
    <>
      Toss the <strong>{NUM_DICE}</strong>{" "}
      <ChosenElement extraInfo="dice">food</ChosenElement>{" "}
      {isMultiDiceSets && (
        <>
          <strong>with{!isOceania && "out"}</strong> faces showing{" "}
          <em>{Food.LABELS.nectar}</em>{" "}
        </>
      )}
      into the birdfeeder dice tower
      {isMultiDiceSets && <em>; put the other set of dice back in the box</em>}.
    </>
  );
}
