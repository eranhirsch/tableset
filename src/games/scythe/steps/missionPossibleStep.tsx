import { Typography } from "@mui/material";
import { $, $nullthrows, Dict, MathUtils, Random, Vec } from "common";
import { CombinationsLazyArray } from "common/standard_library/math/combinationsLazyArray";
import { InstanceCard } from "features/instance/InstanceCard";
import { useRequiredInstanceValue } from "features/instance/useInstanceValue";
import {
  createRandomGameStep,
  InstanceCardsProps,
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
  InstanceCards,
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

function InstanceCards({
  value: index,
  dependencies: [productIds, _isResolution, _resolutionIndex],
  onClick,
}: InstanceCardsProps<
  number,
  readonly ScytheProductId[],
  boolean,
  number
>): JSX.Element {
  const cards = useMemo(
    () => pairFromIndex(index, productIds!),
    [index, productIds]
  );

  return (
    <>
      {Vec.map_with_key(cards, (cardIdStr, cardText, index) => (
        <InstanceCard
          key={cardIdStr}
          title={`Objective ${index === 0 ? "I" : "II"}`}
          subheader="Resolution"
          onClick={onClick}
        >
          <Typography variant="body2" color="primary">
            <strong>{cardText}</strong> ({Number.parseInt(cardIdStr) + 1})
          </Typography>
        </InstanceCard>
      ))}
    </>
  );
}

const pairsArrayForProducts = (
  productIds: readonly ScytheProductId[]
): CombinationsLazyArray<`${number}`> =>
  $(
    Objectives.availableForProducts(productIds),
    ($$) => Vec.map($$, (cardId) => `${cardId}` as `${number}`),
    ($$) => MathUtils.combinations_lazy_array($$, 2)
  );

const pairFromIndex = (
  index: number,
  productIds: readonly ScytheProductId[]
): Readonly<Record<`${number}`, typeof Objectives.cards[number]>> =>
  $(
    pairsArrayForProducts(productIds),
    ($$) => $$.at(index),
    $nullthrows(`Index ${index} is out of range`),
    ($$) =>
      Dict.from_keys(
        $$,
        (cardIdx) => Objectives.cards[Number.parseInt(cardIdx)]
      ),
    ($$) => Dict.sort_by_key($$)
  );
