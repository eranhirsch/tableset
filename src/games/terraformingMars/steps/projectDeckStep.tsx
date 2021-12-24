import { MathUtils, Vec } from "common";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { Decks } from "../utils/Decks";
import corporateEraVariant from "./corporateEraVariant";

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
              These are marked with a red and white icon in the lower left edge.
            </>
          }
        >
          {(Footnote) => (
            <>
              Return all <strong>{Decks.corporateEra.projects}</strong>{" "}
              <ChosenElement extraInfo="project cards">
                Corporate Era
              </ChosenElement>
              <Footnote /> back to the box.
            </>
          )}
        </BlockWithFootnotes>
      )}
      <>
        Shuffle {isCorporateEra ? "all" : "the remaining"}{" "}
        <strong>
          {isCorporateEra
            ? MathUtils.sum(
                Vec.map_with_key(Decks, (_, { projects }) => projects)
              )
            : Decks.base.projects}
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
