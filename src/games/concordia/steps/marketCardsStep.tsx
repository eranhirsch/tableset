import array_range from "../../../common/lib_utils/array_range";
import { PlayerId } from "../../../features/players/playersSlice";
import createDerivedGameStep, {
  DerivedStepInstanceComponentProps,
} from "../../core/steps/createDerivedGameStep";
import createPlayersDependencyMetaStep from "../../core/steps/createPlayersDependencyMetaStep";
import { MARKET_DECK_I } from "../utils/MarketDisplayEncoder";
import GrammaticalList from "../../core/ux/GrammaticalList";
import React from "react";
import { BlockWithFootnotes } from "../../core/ux/BlockWithFootnotes";
import HeaderAndSteps from "../../core/ux/HeaderAndSteps";

const CARDS_PER_DECK = [
  // the array is 0-indexed
  undefined,
  // I: ...
  MARKET_DECK_I.length,
  // II: Architect, Prefect, Mercator, Colonist, Consul, Vintner, Weaver
  7,
  // III: Arhcitect, Prefect, Mercator, Colonist, Diplomat, Consul
  6,
  // IV: Architect, Prefect, Colonist, Diplomat, Consul
  5,
  // V: Prefect, Mercator, Diplomat, Consul
  4,
] as const;

const ROMAN_NUMERALS = [undefined, "I", "II", "III", "IV", "V"];

export default createDerivedGameStep({
  id: "marketCards",
  dependencies: [createPlayersDependencyMetaStep({ max: 5 })],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [playerIds],
}: DerivedStepInstanceComponentProps<readonly PlayerId[]>): JSX.Element {
  return (
    <HeaderAndSteps synopsis="Prepare the personality cards decks:">
      <CardSelectionStep playerIds={playerIds} />
      <>Create a seperate deck for each numeral.</>
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
  const leaveInBox = array_range(playerCount + 1, CARDS_PER_DECK.length).map(
    (x) => <strong key={`leave_in_box_deck_${x}`}>{ROMAN_NUMERALS[x]!}</strong>
  );

  return (
    <>
      Take all cards with{" "}
      <GrammaticalList pluralize="numeral">
        {array_range(playerCount).map((i) => (
          <React.Fragment key={`deck_${i + 1}`}>
            <strong>{ROMAN_NUMERALS[i + 1]}</strong> ({CARDS_PER_DECK[i + 1]}{" "}
            cards)
          </React.Fragment>
        ))}
      </GrammaticalList>{" "}
      on their back
      {leaveInBox.length > 0 && (
        <>
          ;{" "}
          <em>
            leaving cards with{" "}
            <GrammaticalList pluralize="numeral">{leaveInBox}</GrammaticalList>{" "}
            on their back in the box (they won't be needed)
          </em>
        </>
      )}
      .
    </>
  );
}
