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
import turmoilVariant from "./turmoilVariant";
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
    turmoilVariant,
  ],
  skip: ([
    playerIds,
    isVenus,
    isWg,
    _isPrelude,
    _isSoloTr,
    isColonies,
    isTurmoil,
  ]) =>
    !(isWg || (isVenus && playerIds!.length === 1) || isColonies || isTurmoil),

  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [
    playerIds,
    _isVenus,
    isWg,
    isPrelude,
    isSoloTr,
    isColonies,
    isTurmoil,
  ],
}: DerivedStepInstanceComponentProps<
  readonly PlayerId[],
  boolean,
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
        {isTurmoil && (
          // Copied verbatim from the manual
          <HeaderAndSteps synopsis={<strong>TURMOIL:</strong>}>
            <>
              <strong>TR revision:</strong> {!isSolo && "All players "}lose 1
              TR.
            </>
            <>
              <strong>Global Event:</strong> Perform the{" "}
              <em>
                <strong>Current</strong> Global Event
              </em>
              , taking <em>influence</em> into account.
            </>
            <HeaderAndSteps synopsis={<strong>New Government:</strong>}>
              <>
                The Dominant party now becomes ruling.{" "}
                <strong>Change Policy tile.</strong>
              </>
              <>
                Resolve the <strong>Ruling Bonus</strong>
                {!isSolo && " (affects all players)"}.
              </>
              <>
                <strong>Return</strong> the former Chairman and all non-leader
                delegates from Dominant party to reserve.
              </>
              <>
                Party Leader from the Dominant party becomes{" "}
                <strong>new Chairman</strong>, earning 1 TR.
              </>
              <>
                <strong>Dominance marker</strong> goes to new Dominant party (or
                clockwise in case of a tie).
              </>
              <>
                <strong>Fill the lobby</strong> from the reserve so that{" "}
                {isSolo ? "you have" : "each player has"} 1 delegate there.
              </>
            </HeaderAndSteps>
            <HeaderAndSteps synopsis={<strong>Changing Times:</strong>}>
              <>
                Place the Coming Global Event on top of the Current Global
                Event. Add the <strong>neutral delegate</strong> indicated at
                the mid-right on the card.
              </>
              <>
                <strong>Move</strong> the Distance Global Event into the Coming
                Global Event space.
              </>
              <>
                Turn the top card of the Global Event deck face up, add the
                top-left <strong>neutral delegate</strong>, and read the{" "}
                <strong>flavor text</strong>.
              </>
            </HeaderAndSteps>
          </HeaderAndSteps>
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
