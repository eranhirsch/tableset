import { MathUtils } from "common";
import { createGameStep } from "games/core/steps/createGameStep";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";

/**
 * As printed on the board, power is 0-based here (so real power is +1)
 */
const COMBAT_CARDS_DISTRIBUTION = [0, 16, 12, 8, 6] as const;

export default createGameStep({
  id: "combatCardsDeck",
  InstanceManualComponent,
});

function InstanceManualComponent(): JSX.Element {
  return (
    <HeaderAndSteps synopsis="Prepare the combat cards:">
      <BlockWithFootnotes
        footnote={
          <>
            These are {MathUtils.sum(COMBAT_CARDS_DISTRIBUTION)} small cards
            with a yellow back and with varying power values; the distribution
            of power values is printed on the board.
          </>
        }
      >
        {(Footnote) => (
          <>
            Shuffle all combat cards
            <Footnote />.
          </>
        )}
      </BlockWithFootnotes>
      <BlockWithFootnotes footnote={<>At the top right corner.</>}>
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
