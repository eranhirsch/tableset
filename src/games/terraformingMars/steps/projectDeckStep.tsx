import { MathUtils, Vec } from "common";
import { PlayerId } from "features/players/playersSlice";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { playersMetaStep } from "games/global";
import { Decks } from "../utils/Decks";
import corporateEraVariant from "./corporateEraVariant";

export default createDerivedGameStep({
  id: "projectDeck",
  dependencies: [playersMetaStep, corporateEraVariant],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [playerIds, isCorporateEra],
}: DerivedStepInstanceComponentProps<
  readonly PlayerId[],
  boolean
>): JSX.Element {
  const corpEraOrSolo = playerIds!.length === 1 || isCorporateEra;

  return (
    <HeaderAndSteps
      synopsis={
        <>
          Prepare the <ChosenElement extraInfo="deck">projects</ChosenElement>:
        </>
      }
    >
      {!corpEraOrSolo && (
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
        Shuffle {corpEraOrSolo ? "all" : "the remaining"}{" "}
        <strong>
          {corpEraOrSolo
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
