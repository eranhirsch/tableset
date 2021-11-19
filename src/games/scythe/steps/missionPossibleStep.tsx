import { Typography } from "@mui/material";
import { $, $nullthrows, Dict, MathUtils, Random, Vec } from "common";
import { useRequiredInstanceValue } from "features/instance/useInstanceValue";
import {
  createRandomGameStep,
  InstanceCardContentsProps,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { NoConfigPanel } from "games/core/steps/NoConfigPanel";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { IndexHashCaption } from "games/core/ux/IndexHashCaption";
import { isIndexType } from "games/global/coercers/isIndexType";
import { useMemo } from "react";
import { ScytheProductId } from "../ScytheProductId";
import { Objectives } from "../utils/Objectives";
import productsMetaStep from "./productsMetaStep";
import resolutionTileStep, { MISSION_POSSIBLE_ID } from "./resolutionTileStep";
import resolutionVariant from "./resolutionVariant";

export default createRandomGameStep({
  id: "missionPossible",

  labelOverride: "Resolution: Mission Possible",

  isType: isIndexType,

  dependencies: [productsMetaStep, resolutionVariant, resolutionTileStep],

  isTemplatable: (_, isResolution, resolutionTile) =>
    isResolution.canResolveTo(true) &&
    resolutionTile.canResolveTo(MISSION_POSSIBLE_ID),

  resolve: (_config, productIds, isResolution, resolutionTile) =>
    isResolution && resolutionTile === MISSION_POSSIBLE_ID
      ? Random.index(pairsArrayForProducts(productIds!))
      : null,

  skip: (_value, [_productIds, isResolution, resolutionTile]) =>
    !isResolution ||
    (resolutionTile != null && resolutionTile !== MISSION_POSSIBLE_ID),

  ...NoConfigPanel,

  InstanceVariableComponent,
  InstanceManualComponent,
  InstanceCardContents,
});

function InstanceVariableComponent({
  value: idx,
}: VariableStepInstanceComponentProps<number>): JSX.Element {
  const productIds = useRequiredInstanceValue(productsMetaStep);

  const cards = useMemo(
    () => pairFromIndex(idx, productIds),
    [idx, productIds]
  );

  return (
    <>
      <Typography variant="body1">
        Find objective cards{" "}
        <GrammaticalList>
          {Vec.map_with_key(cards, (cardId, text) => (
            <ChosenElement key={cardId} extraInfo={`(${cardId + 1})`}>
              {text}
            </ChosenElement>
          ))}
        </GrammaticalList>{" "}
        and place them near the triumph track.
      </Typography>
      <IndexHashCaption idx={idx} />
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

function InstanceCardContents({
  value: index,
  dependencies: [productIds, _isResolution, _resolutionIndex],
}: InstanceCardContentsProps<
  number,
  readonly ScytheProductId[],
  boolean,
  number
>): JSX.Element {
  const [a, b] = useMemo(
    () => Vec.values(pairFromIndex(index, productIds!)),
    [index, productIds]
  );

  return (
    <>
      <Typography variant="body2" color="primary">
        {a},
      </Typography>
      <Typography variant="body2" color="primary">
        {b}
      </Typography>
    </>
  );
}

const pairsArrayForProducts = (productIds: readonly ScytheProductId[]) =>
  MathUtils.combinations_lazy_array(
    Objectives.availableForProducts(productIds),
    2
  );

const pairFromIndex = (
  index: number,
  productIds: readonly ScytheProductId[]
): Readonly<Record<number, string>> =>
  $(
    pairsArrayForProducts(productIds),
    ($$) => $$.at(index),
    $nullthrows(`Index ${index} is out of range`),
    ($$) => Dict.from_keys($$, (cardIdx) => Objectives.cards[cardIdx]),
    Dict.sort_by_key
  );
