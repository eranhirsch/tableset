import { MathUtils, Vec } from "common";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import React, { useMemo } from "react";
import { DeckId, Decks } from "../utils/Decks";
import europeanBirdsVariant from "./europeanBirdsVariant";
import oceaniaBirdsVariant from "./oceaniaBirdsVariant";
import productsMetaStep, { WingspanProductId } from "./productsMetaStep";
import swiftStartVariant from "./swiftStartVariant";

export default createDerivedGameStep({
  id: "birdCards",
  dependencies: [
    productsMetaStep,
    swiftStartVariant,
    europeanBirdsVariant,
    oceaniaBirdsVariant,
  ],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [productIds, isSwiftStart, isEuropean, isOceania],
}: DerivedStepInstanceComponentProps<
  readonly WingspanProductId[],
  boolean,
  boolean,
  boolean
>): JSX.Element {
  const available = useMemo(
    () => Decks.availableForProducts(productIds!),
    [productIds]
  );

  const used: readonly DeckId[] = useMemo(
    () =>
      Vec.filter_nulls([
        "base",
        isSwiftStart ? null : "swift",
        isEuropean ? "europe" : null,
        isOceania ? "oceania" : null,
      ]),
    [isEuropean, isOceania, isSwiftStart]
  );

  const unused = useMemo(() => Vec.diff(available, used), [available, used]);

  return (
    <HeaderAndSteps>
      {!Vec.is_empty(unused) && (
        <BlockWithFootnotes
          footnotes={Vec.map(unused, (deckId) => (
            <>Identified by a {Decks[deckId].identifier!}.</>
          ))}
        >
          {(Footnote) => (
            <>
              Find and remove{" "}
              <GrammaticalList>
                {React.Children.toArray(
                  Vec.map(unused, (deckId, index) => (
                    <>
                      the <strong>{Decks[deckId].numCards}</strong>{" "}
                      <em>{Decks[deckId].name}</em> cards
                      <Footnote index={index + 1} />
                    </>
                  ))
                )}
              </GrammaticalList>{" "}
              from the main deck and set them aside.
            </>
          )}
        </BlockWithFootnotes>
      )}
      <>
        Shuffle {Vec.is_empty(unused) ? "all" : "the remaining"}{" "}
        <strong>
          {MathUtils.sum(Vec.map(used, (deckId) => Decks[deckId].numCards))}
        </strong>{" "}
        <ChosenElement extraInfo="cards">Bird</ChosenElement> into a deck.
      </>
      <>
        Place it next to the <em>bird tray</em>.
      </>
      <>
        {/* TODO: It's overkill but we technically can randomize */}
        Populate it with <strong>3</strong> face-up bird cards.
      </>
    </HeaderAndSteps>
  );
}
