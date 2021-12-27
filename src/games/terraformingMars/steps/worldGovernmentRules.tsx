import { createDerivedGameStep } from "games/core/steps/createDerivedGameStep";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { RulesSection } from "games/global/ux/RulesSection";
import worldGovernmentVariant from "./worldGovernmentVariant";

export default createDerivedGameStep({
  id: "worldGovernmentRules",
  labelOverride: "Solar Phase: Rules",
  dependencies: [worldGovernmentVariant],
  skip: (isWg) => !isWg,
  InstanceDerivedComponent,
});

function InstanceDerivedComponent(): JSX.Element {
  return (
    <>
      <HeaderAndSteps
        synopsis={
          <>
            <em>Venus Next</em> introduces a new phase{" "}
            <strong>after the production phase</strong> each generation: the{" "}
            <ChosenElement extraInfo="phase">Solar</ChosenElement>
          </>
        }
      >
        <>
          <strong>Game End Check:</strong> if temperature, oxygen, and oceans
          are all maxed out, the game ends and final scoring begins with normal
          conversion of plants
          <em>; No further steps in the Solar Phase are executed</em>.
        </>
        <>
          <strong>World Government Terraforming:</strong> In order to terraform
          Venus without slowing down the terraforming of Mars, the WG has
          decided to help out. The first player (player order hasn't yet
          shifted) now acts as the WG, and chooses a non-maxed global parameter
          and increases that track one step, or places an ocean tile.
        </>
      </HeaderAndSteps>
      <RulesSection>
        <>
          All bonuses goes to the WG, and therefore no TR or other bonuses are
          given to the first player.
        </>
        <>
          Other cards may be triggered by this though, i.e.{" "}
          <em>Arctic Algae</em> or the new corporation <em>Aphrodite</em>.
        </>
      </RulesSection>
    </>
  );
}
