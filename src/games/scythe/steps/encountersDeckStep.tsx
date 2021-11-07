import { createGameStep } from "games/core/steps/createGameStep";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";

const ENCOUNTER_CARDS_COUNT = 28;

export default createGameStep({
  id: "encountersDeck",
  InstanceManualComponent,
});

function InstanceManualComponent(): JSX.Element {
  return (
    <HeaderAndSteps synopsis="Prepare the encounters deck:">
      <BlockWithFootnotes
        footnote={
          <>
            These are {ENCOUNTER_CARDS_COUNT} large cards with a green back,
            numbered in sequence starting from 1 (at the upper left corner of
            the card).
          </>
        }
      >
        {(Footnote) => (
          <>
            Shuffle all encounter cards
            <Footnote />.
          </>
        )}
      </BlockWithFootnotes>
      <BlockWithFootnotes footnote={<>On the bottom right corner.</>}>
        {(Footnote) => (
          <>
            Put the deck face down on the designated area on the board
            <Footnote />.
          </>
        )}
      </BlockWithFootnotes>
    </HeaderAndSteps>
  );
}
