import { Typography } from "@mui/material";
import { Dict, MathUtils, nullthrows, Random, Vec } from "common";
import { useRequiredInstanceValue } from "features/instance/useInstanceValue";
import {
  createRandomGameStep,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { NoConfigPanel } from "games/core/steps/NoConfigPanel";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { IndexHash } from "games/core/ux/IndexHash";
import { useMemo } from "react";
import { ScytheProductId } from "../ScytheProductId";
import { Objectives } from "../utils/Objectives";
import productsMetaStep from "./productsMetaStep";
import resolutionTileStep from "./resolutionTileStep";
import resolutionVariant from "./resolutionVariant";

/**
 * This is the tile number for "Mission Possible", we use a 1-based array to
 * index the result of the `resolutionTileStep`
 */
export const MISSION_POSSIBLE_IDX = 6;

export default createRandomGameStep({
  id: "missionPossible",

  labelOverride: "Resolution: Mission Possible",

  dependencies: [productsMetaStep, resolutionVariant, resolutionTileStep],

  isTemplatable: (_, isResolution, resolutionTile) =>
    isResolution.canResolveTo(true) &&
    resolutionTile.canResolveTo(MISSION_POSSIBLE_IDX),

  resolve: (_config, productIds, isResolution, resolutionTile) =>
    isResolution && resolutionTile === MISSION_POSSIBLE_IDX
      ? Random.index(pairsArrayForProducts(productIds!))
      : null,

  skip: (_value, [_productIds, isResolution, resolutionTile]) =>
    !isResolution ||
    (resolutionTile != null && resolutionTile !== MISSION_POSSIBLE_IDX),

  ...NoConfigPanel,

  InstanceVariableComponent,
  InstanceManualComponent,
});

function InstanceVariableComponent({
  value: idx,
}: VariableStepInstanceComponentProps<number>): JSX.Element {
  const productIds = useRequiredInstanceValue(productsMetaStep);

  const cards = useMemo(
    () =>
      Dict.sort_by_key(
        Dict.from_keys(
          nullthrows(
            pairsArrayForProducts(productIds).at(idx),
            `Index ${idx} is out of range`
          ),
          (cardIdx) => Objectives.cards[cardIdx]
        )
      ),
    [idx, productIds]
  );

  return (
    <>
      <Typography variant="body1">
        Find objective cards{" "}
        <GrammaticalList>
          {Vec.map_with_key(cards, (cardId, text) => (
            <ChosenElement key={cardId} extraInfo={`(${cardId})`}>
              {text}
            </ChosenElement>
          ))}
        </GrammaticalList>{" "}
        and place them near the triumph track.
      </Typography>
      <IndexHash idx={idx} />
    </>
  );
}

function InstanceManualComponent(): JSX.Element {
  return (
    <HeaderAndSteps
      synopsis={
        <>
          Assign global objectives for the <em>Mission Possible</em> resolution:
        </>
      }
    >
      <>Shuffle all objective cards.</>
      <>
        Draw <strong>2</strong> cards from the deck and put them near the
        triumph track.
      </>
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

const pairsArrayForProducts = (productIds: readonly ScytheProductId[]) =>
  MathUtils.combinations_lazy_array(
    Objectives.availableForProducts(productIds),
    2
  );
