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
  const isCorpOrSolo = playerIds!.length === 1 || isCorporateEra;
  return (
    <HeaderAndSteps synopsis="Players are assigned corporations:">
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
              Players <strong>new</strong> to Terraforming Mars:
            </em>{" "}
            Take a <ChosenElement>Beginner Corporation</ChosenElement>
            <em>
              ; all remaining Beginner Corporation cards
              <Footnote /> should be returned back to the box
            </em>
            .
          </>
        )}
      </BlockWithFootnotes>
      {!isCorpOrSolo && (
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
          {isCorpOrSolo
            ? MathUtils.sum(Vec.map_with_key(Decks, (_, { corps }) => corps))
            : Decks.base.corps}
        </strong>{" "}
        <ChosenElement extraInfo="corporations">normal</ChosenElement>.
      </>
      <>
        Deal <strong>2</strong> corporations to each remaining player
        <em>; players should keep these cards hidden</em>.
      </>
    </HeaderAndSteps>
  );
}
