import { PlayerId } from "features/players/playersSlice";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { playersMetaStep } from "games/global";
import { RulesSection } from "games/global/ux/RulesSection";
import coloniesVariant from "./coloniesVariant";
import preludeVariant from "./preludeVariant";
import { NUM_GENS } from "./soloRules";
import trSoloVariant from "./trSoloVariant";
import venusVariant from "./venusVariant";
import worldGovernmentVariant from "./worldGovernmentVariant";

export default createDerivedGameStep({
  id: "solarPhaseRules",
  labelOverride: "Solar Phase: Rules",
  dependencies: [
    playersMetaStep,
    venusVariant,
    worldGovernmentVariant,
    preludeVariant,
    trSoloVariant,
    coloniesVariant,
  ],
  skip: ([playerIds, isVenus, isWg, _isPrelude, _isSoloTr, isColonies]) =>
    !(isColonies || (playerIds!.length === 1 ? isVenus : isWg)),
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [playerIds, _isVenus, isWg, isPrelude, isSoloTr, isColonies],
}: DerivedStepInstanceComponentProps<
  readonly PlayerId[],
  boolean,
  boolean,
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
            The <ChosenElement extraInfo="phase">Solar</ChosenElement> takes
            place <strong>after the production phase</strong> each generation:
          </>
        }
      >
        <>
          <strong>Game End Check:</strong> if temperature, oxygen,{" "}
          {isSolo && !isSoloTr && "venus scale, "}and oceans are all maxed out,{" "}
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
        {isWg && (
          <>
            <strong>World Government Terraforming:</strong> In order to
            terraform Venus without slowing down the terraforming of Mars, the
            WG has decided to help out.{" "}
            {isSolo
              ? "you now act"
              : "The first player (player order hasn't yet shifted) now acts"}{" "}
            as the WG, and {isSolo ? "chose" : "chooses"} a non-maxed global
            parameter and increases that track one step, or places an ocean
            tile.
          </>
        )}
        {isColonies && (
          <>
            <strong>Colony Production:</strong> Return all Trade Fleets from the
            Colony Tiles to the Trade Fleets Tile. Move the white marker one
            step up the Colony track on each Colony Tile.
          </>
        )}
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
