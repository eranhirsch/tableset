import { Vec } from "common";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { ScytheProductId } from "../ScytheProductId";
import { Objectives } from "../utils/Objectives";
import missionPossibleStep, {
  MISSION_POSSIBLE_IDX,
} from "./missionPossibleStep";
import productsMetaStep from "./productsMetaStep";
import resolutionTileStep from "./resolutionTileStep";
import resolutionVariant from "./resolutionVariant";

export default createDerivedGameStep({
  id: "objectivesDeck",
  dependencies: [
    productsMetaStep,
    resolutionVariant,
    resolutionTileStep,
    missionPossibleStep,
  ],
  skip: ([_products, isResolution, resolutionTile, missionPossibleHash]) =>
    isResolution! &&
    resolutionTile === MISSION_POSSIBLE_IDX &&
    missionPossibleHash == null,
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [productIds, isResolutions, resolution, missionPossibleHash],
}: DerivedStepInstanceComponentProps<
  readonly ScytheProductId[],
  boolean,
  number,
  string
>): JSX.Element {
  const isMissionPossible =
    isResolutions && resolution === MISSION_POSSIBLE_IDX;
  return (
    <HeaderAndSteps synopsis="Prepare the objectives deck:">
      <BlockWithFootnotes
        footnotes={Vec.concat(
          [
            <>
              These are {Objectives.availableForProducts(productIds!).length}{" "}
              regular-sized cards with a beige back, numbered in sequence
              starting from 1 (at the upper left corner of the card).
            </>,
          ],
          isMissionPossible
            ? [
                <>
                  Notice that <strong>2</strong> cards are already in use for
                  the <em>Mission Possible</em> resolution.
                </>,
              ]
            : []
        )}
      >
        {(Footnote) => (
          <>
            Shuffle all objective cards
            <Footnote index={1} />
            {isMissionPossible && <Footnote index={2} />}.
          </>
        )}
      </BlockWithFootnotes>
      <BlockWithFootnotes footnote={<>At the bottom.</>}>
        {(Footnote) => (
          <>
            Put the deck face down on the designated area on the board
            <Footnote />.
          </>
        )}
      </BlockWithFootnotes>
    </HeaderAndSteps>
  );
}
