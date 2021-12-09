import { Vec } from "common";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { playersMetaStep } from "games/global";
import { PlayerId } from "model/Player";

// "Each deck contains eight 4+ cards and six 3+ cards" (manual, p.11)
const REMOVED_CARDS = [null, null, 6 * 3, 8 * 3] as const;

export default createDerivedGameStep({
  id: "ageDecks",
  dependencies: [playersMetaStep],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [playerIds],
}: DerivedStepInstanceComponentProps<readonly PlayerId[]>): JSX.Element {
  const removed = Vec.map(REMOVED_CARDS, (cardsRemoved, playerCount) =>
    playerCount < playerIds!.length ? null : cardsRemoved
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
                  <strong>{playerCount + 1}+</strong> ({count} cards)
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
