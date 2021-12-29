import { PlayerId } from "features/players/playersSlice";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { playersMetaStep } from "games/global";
import preludeVariant from "./preludeVariant";
import trSoloVariant, { TR_GOAL } from "./trSoloVariant";
import venusVariant from "./venusVariant";

export const NUM_GENS = { regular: 14, prelude: 12 } as const;

export default createDerivedGameStep({
  id: "soloRules",
  labelOverride: "Solo: Rules",
  dependencies: [playersMetaStep, venusVariant, preludeVariant, trSoloVariant],
  skip: ([playerIds]) => playerIds!.length > 1,
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [_playerIds, isVenus, isPrelude, isTrSolo],
}: DerivedStepInstanceComponentProps<
  readonly PlayerId[],
  boolean,
  boolean,
  boolean
>): JSX.Element {
  const numGenerations = NUM_GENS[isPrelude ? "prelude" : "regular"];
  return (
    <HeaderAndSteps synopsis="In Solo play the following rules are added:">
      {/* Copied verbatim from the manual */}
      <>Awards and Milestones are not used.</>
      <>
        You have a neutral opponent that you can steal from, or reduce any kind
        of resources and production from.
      </>
      <>
        You always play <strong>{numGenerations}</strong> generations (
        {isPrelude
          ? "mark this with a gold cube at generation 12"
          : "marked 'solo'"}
        ).
      </>
      <>
        In order to win, you need to{" "}
        {isTrSolo ? (
          <>
            reach a Terraform Rating of <strong>{TR_GOAL}</strong> in{" "}
            {numGenerations} generations
          </>
        ) : (
          <>
            complete terraforming (i.e making the 3 global parameters reach
            their goal) before the end of generation {numGenerations}
          </>
        )}
        .
      </>
      {isVenus && !isTrSolo && (
        <>
          <strong>Venus Next:</strong> you also need to max out the{" "}
          <em>Venus Scale</em>.
        </>
      )}
      <>
        After generation {numGenerations}, you may convert plants into greenery
        tiles, following normal rules but without raising the oxygen.
      </>
      {!isTrSolo && <>You score VPs to get as high a score as possible.</>}
      <>
        If you have not{" "}
        {isTrSolo ? "reached the TR goal" : "completed terraforming"} by the end
        of generation {numGenerations}, you lose.
      </>
      {isTrSolo && (
        <>
          <strong>TR Solo:</strong> a new standard project is introduced,{" "}
          <strong>BUFFER GAS</strong>, which costs <em>16M€</em> and gives{" "}
          <em>1 TR</em>.
        </>
      )}
    </HeaderAndSteps>
  );
}
