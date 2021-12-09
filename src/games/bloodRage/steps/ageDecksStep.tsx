import { $, MathUtils, Vec } from "common";
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
import mysticsVariant from "./mysticsVariant";
import productsMetaStep, { BloodRageProductId } from "./productsMetaStep";

const REMOVED_CARDS = [
  0, 0,
  // "Each deck contains eight 4+ cards and six 3+ cards" (manual, p.11)
  6, 8,
  // "this expansion box comes with 24 "Gods' Gifts" cards (8 for each Age
  // deck)" (BoardGameGeek product description page)
  8,
] as const;

// There's exactly 1 card in each age that has a 4+ indication in the Mystics
// expansion
const MYSTICS_CARDS = [0, 0, 0, 1, 0] as const;

export default createDerivedGameStep({
  id: "ageDecks",
  dependencies: [playersMetaStep, productsMetaStep, mysticsVariant],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [playerIds, productIds, isMystics],
}: DerivedStepInstanceComponentProps<
  readonly PlayerId[],
  readonly BloodRageProductId[],
  boolean
>): JSX.Element {
  const removed = useMemo(
    () =>
      $(
        REMOVED_CARDS,
        // Add the mystics card if the expansion exists
        ($$) =>
          productIds!.includes("mystics")
            ? Vec.map(Vec.zip($$, MYSTICS_CARDS), MathUtils.sum)
            : $$,
        ($$) => Vec.take($$, productIds!.includes("player5") ? 5 : 4),
        ($$) =>
          Vec.map($$, (cardsRemoved, playerCount) =>
            playerCount < playerIds!.length ? 0 : cardsRemoved
          )
      ),
    [playerIds, productIds]
  );

  return (
    <HeaderAndSteps>
      {removed.some((count) => count > 0) && (
        <>
          Remove all cards with a small{" "}
          <GrammaticalList>
            {Vec.maybe_map(removed, (count, playerCount) =>
              count > 0 ? (
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
      {!isMystics && productIds!.includes("mystics") && (
        <>
          Remove all Clan Upgrades referring to Mystics (
          {playerIds!.length >= 4 ? 2 : 1} cards in each age)
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
