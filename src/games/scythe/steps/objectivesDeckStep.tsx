import { createDerivedGameStep } from "games/core/steps/createDerivedGameStep";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";

const OBJECTIVE_CARDS_COUNT = 23;

export default createDerivedGameStep({
  id: "objectivesDeck",
  dependencies: [],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent(): JSX.Element {
  return (
    <HeaderAndSteps synopsis="Prepare the objectives deck:">
      <BlockWithFootnotes
        footnote={
          <>
            These are {OBJECTIVE_CARDS_COUNT} regular-sized cards with a beige
            back, numbered in sequence starting from 1 (at the upper left corner
            of the card).
          </>
        }
      >
        {(Footnote) => (
          <>
            Shuffle all objective cards
            <Footnote />.
          </>
        )}
      </BlockWithFootnotes>
      <BlockWithFootnotes footnote={<>At the bottom.</>}>
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
