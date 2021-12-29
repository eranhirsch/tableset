import { PlayerId } from "features/players/playersSlice";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { playersMetaStep } from "games/global";
import { RulesSection } from "games/global/ux/RulesSection";
import preludeVariant from "./preludeVariant";
import { NUM_GENS } from "./soloRules";
import venusVariant from "./venusVariant";
import worldGovernmentVariant from "./worldGovernmentVariant";

export default createDerivedGameStep({
  id: "worldGovernmentRules",
  labelOverride: "Solar Phase: Rules",
  dependencies: [
    playersMetaStep,
    venusVariant,
    worldGovernmentVariant,
    preludeVariant,
  ],
  skip: ([playerIds, isVenus, isWg, _isPrelude]) =>
    playerIds!.length === 1 ? !isVenus : !isWg,
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [playerIds, _isVenus, _isWg, isPrelude],
}: DerivedStepInstanceComponentProps<
  readonly PlayerId[],
  boolean,
  boolean,
  boolean
>): JSX.Element {
  const isSolo = playerIds!.length === 1;
  const numGenerations = NUM_GENS[isPrelude ? "prelude" : "regular"];
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
          <strong>Game End Check:</strong> if temperature, oxygen,{" "}
          {isSolo && "venus scale, "}and oceans are all maxed out,{" "}
          {isSolo && (
            <>
              or you just played the <strong>{numGenerations}th</strong>{" "}
              generation,{" "}
            </>
          )}
          the game ends and final scoring begins with normal conversion of
          plants
          <em>; No further steps in the Solar Phase are executed</em>.
        </>
        <>
          <strong>World Government Terraforming:</strong> In order to terraform
          Venus without slowing down the terraforming of Mars, the WG has
          decided to help out.{" "}
          {isSolo
            ? "you now act"
            : "The first player (player order hasn't yet shifted) now acts"}{" "}
          as the WG, and {isSolo ? "chose" : "chooses"} a non-maxed global
          parameter and increases that track one step, or places an ocean tile.
        </>
      </HeaderAndSteps>
      <RulesSection>
        <>
          All bonuses goes to the WG, and therefore no TR or other bonuses are{" "}
          {isSolo ? "gained" : "given to the first player"}.
        </>
        <>
          Other cards may be triggered by this though, i.e.{" "}
          <em>Arctic Algae</em> or the new corporation <em>Aphrodite</em>.
        </>
      </RulesSection>
    </>
  );
}
