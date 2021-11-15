import { Typography } from "@mui/material";
import { Dict, MathUtils, nullthrows, Num, Random, Vec } from "common";
import { useRequiredInstanceValue } from "features/instance/useInstanceValue";
import {
  createRandomGameStep,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { NoConfigPanel } from "games/core/steps/NoConfigPanel";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
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
const MISSION_POSSIBLE_IDX = 6;

export default createRandomGameStep({
  id: "missionPossible",

  dependencies: [productsMetaStep, resolutionVariant, resolutionTileStep],

  isTemplatable: (_, isResolution, resolutionTile) =>
    isResolution.canResolveTo(true) &&
    resolutionTile.canResolveTo(MISSION_POSSIBLE_IDX),

  resolve: (_config, productIds, isResolution, resolutionTile) =>
    isResolution && resolutionTile === MISSION_POSSIBLE_IDX
      ? Num.encode_base32(Random.index(pairsArrayForProducts(productIds!)))
      : null,

  skip: (_value, [_productIds, isResolution, resolutionTile]) =>
    !isResolution ||
    (resolutionTile != null && resolutionTile !== MISSION_POSSIBLE_IDX),

  ...NoConfigPanel,

  InstanceVariableComponent,
});

function InstanceVariableComponent({
  value: hash,
}: VariableStepInstanceComponentProps<string>): JSX.Element {
  const productIds = useRequiredInstanceValue(productsMetaStep);

  const cards = useMemo(
    () =>
      Dict.sort_by_key(
        Dict.from_keys(
          nullthrows(
            pairsArrayForProducts(productIds).at(Num.decode_base32(hash)),
            `Hash ${hash} is out of range`
          ),
          (cardIdx) => Objectives.cards[cardIdx]
        )
      ),
    [hash, productIds]
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
      <Typography variant="caption" sx={{ marginTop: 2 }}>
        <pre>Hash: {hash}</pre>
      </Typography>
    </>
  );
}

const pairsArrayForProducts = (productIds: readonly ScytheProductId[]) =>
  MathUtils.combinations_lazy_array(
    Objectives.availableForProducts(productIds),
    2
  );
