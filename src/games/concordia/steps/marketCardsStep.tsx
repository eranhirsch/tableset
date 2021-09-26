import { Vec } from "common";
import { PlayerId } from "model/Player";
import React from "react";
import createDerivedGameStep, {
  DerivedStepInstanceComponentProps,
} from "../../core/steps/createDerivedGameStep";
import createPlayersDependencyMetaStep from "../../core/steps/createPlayersDependencyMetaStep";
import { BlockWithFootnotes } from "../../core/ux/BlockWithFootnotes";
import GrammaticalList from "../../core/ux/GrammaticalList";
import HeaderAndSteps from "../../core/ux/HeaderAndSteps";
import { MARKET_DECK_I } from "../utils/MarketDisplayEncoder";
import { ROMAN_NUMERALS } from "../utils/ROMAN_NUMERALS";

const CARDS_PER_DECK = [
  // the array is 0-indexed
  undefined,
  // I: ...
  MARKET_DECK_I.length,
  // II: Architect, Prefect, Mercator, Colonist, Consul, Vintner, Weaver
  7,
  // III: Architect, Prefect, Mercator, Colonist, Diplomat, Consul
  6,
  // IV: Architect, Prefect, Colonist, Diplomat, Consul
  5,
  // V: Prefect, Mercator, Diplomat, Consul
  4,
] as const;

const MAX_PLAYER_COUNT = CARDS_PER_DECK.length - 1;

export default createDerivedGameStep({
  id: "personalityCards",
  dependencies: [createPlayersDependencyMetaStep({ max: MAX_PLAYER_COUNT })],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [playerIds],
}: DerivedStepInstanceComponentProps<readonly PlayerId[]>): JSX.Element {
  return (
    <HeaderAndSteps synopsis="Prepare the personality cards decks:">
      <CardSelectionStep playerIds={playerIds} />
      <>Create a separate deck for each numeral.</>
    </HeaderAndSteps>
  );
}

function CardSelectionStep({
  playerIds,
}: {
  playerIds: readonly PlayerId[] | null | undefined;
}): JSX.Element {
  if (playerIds == null) {
    // The player count dependency failed, this could be either that the number
    // of players is too high to be meaningful for concordia, or too low (0)
    return (
      <>
        <BlockWithFootnotes
          footnotes={[
            <>
              e.g. for a 3 player game take all cards with numerals I, II, and
              III.
            </>,
            <>
              e.g. for a 3 player game leave cards with numerals IV and V in the
              box.
            </>,
          ]}
        >
          {(Footnote) => (
            <>
              Take all cards with numerals on their back with value up to and
              including the number of players
              <Footnote index={1} />;{" "}
              <em>
                leaving cards with higher values
                <Footnote index={2} /> in the box (they won't be needed)
              </em>
              .
            </>
          )}
        </BlockWithFootnotes>
      </>
    );
  }

  const playerCount = playerIds.length;

  return (
    <BlockWithFootnotes
      footnotes={Vec.filter_nulls(
        CARDS_PER_DECK.map(
          (count, index) =>
            count && (
              <>
                {count} cards with numeral{" "}
                <strong>{ROMAN_NUMERALS[index]}</strong>.
              </>
            )
        )
      )}
    >
      {(Footnote) => (
        <>
          Take all cards with{" "}
          <GrammaticalList pluralize="numeral">
            {Vec.range(1, playerCount).map((i) => (
              <React.Fragment key={`deck_${i}`}>
                <strong>{ROMAN_NUMERALS[i]}</strong>
                <Footnote index={i} />
              </React.Fragment>
            ))}
          </GrammaticalList>{" "}
          on their back
          {playerCount < MAX_PLAYER_COUNT && (
            <>
              ;{" "}
              <em>
                leaving cards with{" "}
                <GrammaticalList pluralize="numeral">
                  {Vec.range(playerCount + 1, CARDS_PER_DECK.length - 1).map(
                    (x) => (
                      <React.Fragment key={`leave_in_box_deck_${x}`}>
                        <strong>{ROMAN_NUMERALS[x]!}</strong>
                        <Footnote index={x} />
                      </React.Fragment>
                    )
                  )}
                </GrammaticalList>{" "}
                on their back in the box (they won't be needed)
              </em>
            </>
          )}
          .
        </>
      )}
    </BlockWithFootnotes>
  );
}
