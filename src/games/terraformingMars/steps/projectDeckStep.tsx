import { MathUtils, Vec } from "common";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import corporateEraVariant from "./corporateEraVariant";

const ALL_PROJECT_CARD_TYPES = ["base", "corp"] as const;
type ProjectCardType = typeof ALL_PROJECT_CARD_TYPES[number];
const NUM_PROJECT_CARD: Readonly<Required<Record<ProjectCardType, number>>> = {
  base: 137,
  corp: 71,
};

export default createDerivedGameStep({
  id: "projectDeck",
  dependencies: [corporateEraVariant],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [isCorporateEra],
}: DerivedStepInstanceComponentProps<boolean>): JSX.Element {
  return (
    <HeaderAndSteps
      synopsis={
        <>
          Prepare the <ChosenElement extraInfo="deck">projects</ChosenElement>:
        </>
      }
    >
      {!isCorporateEra && (
        <BlockWithFootnotes
          footnote={
            <>
              These are marked with a red and white icon in the lower left edge
            </>
          }
        >
          {(Footnote) => (
            <>
              Return all <strong>{NUM_PROJECT_CARD.corp}</strong>{" "}
              <ChosenElement extraInfo="cards">Corporate Era</ChosenElement>
              <Footnote /> to the box.
            </>
          )}
        </BlockWithFootnotes>
      )}
      <>
        Shuffle {isCorporateEra ? "all" : "the remaining"}{" "}
        <strong>
          {isCorporateEra
            ? MathUtils.sum(Vec.values(NUM_PROJECT_CARD))
            : NUM_PROJECT_CARD.base}
        </strong>{" "}
        project cards.
      </>
      <>
        Place the project deck next to the board
        <em>; Leave space for a discard pile beside it</em>.
      </>
    </HeaderAndSteps>
  );
}
