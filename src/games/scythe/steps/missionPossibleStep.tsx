import { Typography } from "@mui/material";
import { Dict, MathUtils, nullthrows, Num, Random, Vec } from "common";
import {
  createRandomGameStep,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { NoConfigPanel } from "games/core/steps/NoConfigPanel";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import { useMemo } from "react";
import productsMetaStep from "./productsMetaStep";
import resolutionTileStep from "./resolutionTileStep";
import resolutionVariant from "./resolutionVariant";

const OBJECTIVES = [
  // skip this, it's just here to make the array 1-based to match the cards
  "__ERROR",

  "Higher Ground Advantage",
  "Underworld Advantage",
  "Harvest Advantage",
  "Northern Advantage",
  "King of the Hill",
  "Send One Back as a Warning",
  "Machine Over Muscle",
  "Roll Up Your Sleeves with the Common Man",
  "Woodland Advantage",
  "Population Advantage",
  "Get Rich or Cry Trying",
  "Foundations of the Empire",
  "Hedge Your Bets",
  "Balanced Workforce",
  "A Wolf Among the Sheep",
  "Divide and Conquer",
  "Become a Beloved Pacifist",
  "Shore up the Shore",
  "Create a Permanent Foothold",
  "Monopolize the Market",
  "Technological Breakthrough",
  "Achieve Tactical Mastery",
] as const;

const PAIRS_ARRAY = MathUtils.combinations_lazy_array(
  // Remove the first dud item
  Vec.drop(OBJECTIVES, 1),
  2
);

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

  resolve: (_config, _productIds, isResolution, resolutionTile) =>
    isResolution && resolutionTile === MISSION_POSSIBLE_IDX
      ? Num.encode_base32(Random.index(PAIRS_ARRAY))
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
  const cards = useMemo(
    () =>
      Dict.sort_by_key(
        Dict.from_values(
          nullthrows(
            PAIRS_ARRAY.at(Num.decode_base32(hash)),
            `Hash ${hash} is out of range for ${PAIRS_ARRAY}`
          ),
          (card) => OBJECTIVES.indexOf(card)
        )
      ),
    [hash]
  );

  return (
    <>
      <Typography variant="body1">
        Find objective cards{" "}
        <GrammaticalList>
          {Vec.map_with_key(cards, (cardId, text) => (
            <Typography key={cardId} component="span" color="primary">
              <strong>{text}</strong>
              {"\u00A0"}({cardId})
            </Typography>
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

