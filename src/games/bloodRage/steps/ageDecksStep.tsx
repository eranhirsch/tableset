import { $, Vec } from "common";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { playersMetaStep } from "games/global";
import { PlayerId } from "model/Player";
import { useMemo } from "react";
import productsMetaStep, { BloodRageProductId } from "./productsMetaStep";

const REMOVED_CARDS = [
  null,
  null,
  // "Each deck contains eight 4+ cards and six 3+ cards" (manual, p.11)
  6,
  8,
  // "this expansion box comes with 24 "Gods' Gifts" cards (8 for each Age
  // deck)" (BoardGameGeek product description page)
  8,
] as const;

export default createDerivedGameStep({
  id: "ageDecks",
  dependencies: [playersMetaStep, productsMetaStep],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [playerIds, productIds],
}: DerivedStepInstanceComponentProps<
  readonly PlayerId[],
  readonly BloodRageProductId[]
>): JSX.Element {
  const removed = useMemo(
    () =>
      $(
        REMOVED_CARDS,
        ($$) => Vec.take($$, productIds!.includes("player5") ? 5 : 4),
        ($$) =>
          Vec.map($$, (cardsRemoved, playerCount) =>
            playerCount < playerIds!.length ? null : cardsRemoved
          )
      ),
    [playerIds, productIds]
  );

  return (
    <HeaderAndSteps>
      {removed.some((count) => count != null) && (
        <>
          Remove all cards with a small{" "}
          <GrammaticalList>
            {Vec.maybe_map(removed, (count, playerCount) =>
              count != null ? (
                <>
                  <strong>{playerCount + 1}+</strong> ({count} cards in each
                  age)
                </>
              ) : undefined
            )}
          </GrammaticalList>{" "}
          shown on the left side.
        </>
      )}
      <>
        Separate the cards by their card backs, creating three different decks:
        1, 2, and 3.
      </>
      <>Shuffle each of the three decks separately.</>
      <>
        Place them, face down, on the appropriate{" "}
        <ChosenElement>Gods' Gifts spots</ChosenElement> of the Age Track.
      </>
    </HeaderAndSteps>
  );
}
