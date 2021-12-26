import { createDerivedGameStep } from "games/core/steps/createDerivedGameStep";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { RulesSection } from "games/global/ux/RulesSection";
import venusVariant from "./venusVariant";

export default createDerivedGameStep({
  id: "venusMilestoneAndAward",
  labelOverride: "Venus: Milestone and Award",
  dependencies: [venusVariant],
  skip: ([isVenus]) => !isVenus,
  InstanceDerivedComponent,
});

function InstanceDerivedComponent(): JSX.Element {
  return (
    <>
      <HeaderAndSteps>
        <>
          Place the{" "}
          <ChosenElement extraInfo="Milestone tile">Hoverlord</ChosenElement> so
          that it covers the Milestones headline on the game board.
        </>
        <>
          Place the{" "}
          <ChosenElement extraInfo="Award tile">Venuphile</ChosenElement> so
          that it covers the Awards headline on the game board.
        </>
      </HeaderAndSteps>
      <RulesSection>
        {/* Spell-checker: disable */}
        <>
          Hoverlord works in addition to existing Milestones, so that 3 out of 6
          Milestones may be claimed.
        </>
        <>
          To claim Hoverlord, you need a total of at least 7 floater resources
          on your cards.
        </>
        <>
          Venuphile also works in addition to existing Awards, so that 3 out of
          6 may be funded.
        </>
        <>Venuphile Award is a contest for most Venus tags in play.</>
        {/* Spell-checker: enable */}
      </RulesSection>
    </>
  );
}
