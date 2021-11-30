import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { playersMetaStep } from "games/global";
import { PlayerId } from "model/Player";
import { FactoryCards } from "../utils/FactoryCards";

export default createDerivedGameStep({
  id: "factoryDeck",
  // TODO: Depend on the products, factions and homebases, and fix the content
  // if vesna cards are either known to be used, or might be used.
  dependencies: [playersMetaStep],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [players, vesnaCards],
}: DerivedStepInstanceComponentProps<readonly PlayerId[]>): JSX.Element {
  return (
    <HeaderAndSteps synopsis="Prepare the Factory deck:">
      <BlockWithFootnotes
        footnote={
          <>
            These are {FactoryCards.BASE_IDS.length} large cards with a purple
            back, numbered in sequence starting from 1 (at the upper right
            corner of the card).
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
          returning the remaining{" "}
          {FactoryCards.BASE_IDS.length - (players!.length + 1)} cards to the
          box without looking at them either.
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
