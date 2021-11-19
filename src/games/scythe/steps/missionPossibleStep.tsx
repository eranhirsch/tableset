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
import { IndexHashCaption } from "games/core/ux/IndexHashCaption";
import { IndexHashInstanceCardContents } from "games/core/ux/IndexHashInstanceCardContents";
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
  InstanceCardContents: IndexHashInstanceCardContents,
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

const pairsArrayForProducts = (productIds: readonly ScytheProductId[]) =>
  MathUtils.combinations_lazy_array(
    Objectives.availableForProducts(productIds),
    2
  );
