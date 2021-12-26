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
  id: "corporation",
  dependencies: [playersMetaStep, corporateEraVariant],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [playerIds, isCorporateEra],
}: DerivedStepInstanceComponentProps<
  readonly PlayerId[],
  boolean
>): JSX.Element {
  const isSolo = playerIds!.length === 1;
  return (
    <HeaderAndSteps>
      <BlockWithFootnotes
        footnote={
          <>
            There are <strong>5</strong> Beginner Corporation cards.
          </>
        }
      >
        {(Footnote) => (
          <>
            <em>
              {isSolo ? "If" : "Players"} <strong>new</strong> to Terraforming
              Mars:
            </em>{" "}
            Take a <ChosenElement>Beginner Corporation</ChosenElement>
            {isSolo ? (
              <>
                {" "}
                and skip the rest of this step.{" "}
                <em>
                  Otherwise put all Beginner Corporation cards back in the box
                </em>
              </>
            ) : (
              <em>
                ; all remaining Beginner Corporation cards
                <Footnote /> should be returned back to the box
              </em>
            )}
            .
          </>
        )}
      </BlockWithFootnotes>
      {!isSolo && !isCorporateEra && (
        <BlockWithFootnotes
          footnote={
            <>
              These are marked with a red and white icon in the lower left edge.
            </>
          }
        >
          {(Footnote) => (
            <>
              Return all <strong>{Decks.corporateEra.corps}</strong>{" "}
              <ChosenElement extraInfo="corporations">
                Corporate Era
              </ChosenElement>
              <Footnote /> back to the box.
            </>
          )}
        </BlockWithFootnotes>
      )}
      <>
        Shuffle the remaining{" "}
        <strong>
          {isSolo || isCorporateEra
            ? MathUtils.sum(Vec.map_with_key(Decks, (_, { corps }) => corps))
            : Decks.base.corps}
        </strong>{" "}
        <ChosenElement extraInfo="corporations">normal</ChosenElement>.
      </>
      <>
        {isSolo ? "Draw" : "Deal"} <strong>2</strong> corporations
        {!isSolo && (
          <>
            {" "}
            to each remaining player
            <em>; players should keep these cards hidden</em>
          </>
        )}
        .
      </>
    </HeaderAndSteps>
  );
}
