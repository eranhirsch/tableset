import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { playersMetaStep } from "games/global";
import { PlayerId } from "model/Player";

const FACTORY_CARDS_COUNT = 12;

export default createDerivedGameStep({
  id: "factoryDeck",
  dependencies: [playersMetaStep],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [players],
}: DerivedStepInstanceComponentProps<readonly PlayerId[]>): JSX.Element {
  return (
    <HeaderAndSteps synopsis="Prepare the Factory deck:">
      <BlockWithFootnotes
        footnote={
          <>
            These are {FACTORY_CARDS_COUNT} large cards with a purple back,
            numbered in sequence starting from 1 (at the upper right corner of
            the card).
          </>
        }
      >
        {(Footnote) => (
          <>
            Shuffle all factory cards
            <Footnote />.
          </>
        )}
      </BlockWithFootnotes>
      <>
        Draw <strong>{players!.length + 1}</strong> cards from the deck without
        looking at them;{" "}
        <em>
          returning the remaining {FACTORY_CARDS_COUNT - (players!.length + 1)}{" "}
          cards to the box without looking at them either.
        </em>
      </>
      <BlockWithFootnotes footnote={<>On the right.</>}>
        {(Footnote) => (
          <>
            Put the deck of drawn cards face down on the designated area on the
            board
            <Footnote />.
          </>
        )}
      </BlockWithFootnotes>
    </HeaderAndSteps>
  );
}
