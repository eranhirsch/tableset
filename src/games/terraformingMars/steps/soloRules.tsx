import { createDerivedGameStep } from "games/core/steps/createDerivedGameStep";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { playersMetaStep } from "games/global";

export default createDerivedGameStep({
  id: "soloRules",
  labelOverride: "Solo: Rules",
  dependencies: [playersMetaStep],
  skip: ([playerIds]) => playerIds!.length > 1,
  InstanceDerivedComponent,
});

function InstanceDerivedComponent(): JSX.Element {
  return (
    <HeaderAndSteps synopsis="In Solo play the following rules are added:">
      {/* Copied verbatim from the manual */}
      <>Awards and Milestones are not used.</>
      <>
        You have a neutral opponent that you can steal from, or reduce any kind
        of resources and production from.
      </>
      <>You always play 14 generations (marked 'solo').</>
      <>
        In order to win, you need to complete terraforming (i.e making the three
        global parameters reach their goal) before the end of generation 14.
      </>
      <>
        After generation 14, you may convert plants into greenery tiles,
        following normal rules but without raising the oxygen
      </>
      <>You score VPs to get as high a score as possible.</>
      <>
        If you have not completed terraforming by the end of generation 14, you
        lose.
      </>
    </HeaderAndSteps>
  );
}
