import { MathUtils, Vec } from "common";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import swiftStartVariant from "./swiftStartVariant";

const ALL_DECK_IDS = ["swiftStart", "base"] as const;
type DeckId = typeof ALL_DECK_IDS[number];
const DECK_CARD_COUNT: Readonly<Required<Record<DeckId, number>>> = {
  base: 170,
  swiftStart: 10,
};

export default createDerivedGameStep({
  id: "birdCards",
  dependencies: [swiftStartVariant],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [isSwiftStart],
}: DerivedStepInstanceComponentProps<boolean>): JSX.Element {
  return (
    <HeaderAndSteps>
      {isSwiftStart && (
        <BlockWithFootnotes footnote={<>Marked with gray corners</>}>
          {(Footnote) => (
            <>
              Find and remove the <strong>{DECK_CARD_COUNT.swiftStart}</strong>{" "}
              <ChosenElement extraInfo="cards">Swift-Start</ChosenElement> from
              the main deck
              <Footnote /> and set them aside.
            </>
          )}
        </BlockWithFootnotes>
      )}
      <>
        Shuffle the{" "}
        <strong>
          {isSwiftStart
            ? DECK_CARD_COUNT.base
            : MathUtils.sum(Vec.values(DECK_CARD_COUNT))}
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
