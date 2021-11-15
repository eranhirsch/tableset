import { Typography } from "@mui/material";
import { MathUtils, Random } from "common";
import {
  createRandomGameStep,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { NoConfigPanel } from "games/core/steps/NoConfigPanel";
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

const MISSION_POSSIBLE_IDX = 5;

export default createRandomGameStep({
  id: "missionPossibleEncounters",

  dependencies: [productsMetaStep, resolutionVariant, resolutionTileStep],

  isTemplatable: (_, isResolution, resolutionTile) =>
    isResolution.canResolveTo(true) &&
    resolutionTile.canResolveTo(MISSION_POSSIBLE_IDX),

  resolve: (_config, _productIds, isResolution, resolutionTile) =>
    isResolution && resolutionTile === MISSION_POSSIBLE_IDX
      ? Random.index(MathUtils.combinations_lazy_array(OBJECTIVES, 2))
      : null,

  skip: (_value, [_productIds, isResolution, resolutionTile]) =>
    !isResolution ||
    (resolutionTile != null && resolutionTile !== MISSION_POSSIBLE_IDX),

  ...NoConfigPanel,

  InstanceVariableComponent,
});

function InstanceVariableComponent({
  value: index,
}: VariableStepInstanceComponentProps<number>): JSX.Element {
  const [a, b] = useMemo(
    () => MathUtils.combinations_lazy_array(OBJECTIVES, 2).at(index)!,
    [index]
  );
  return (
    <Typography variant="body1">
      Find objective cards <strong>{a}</strong> and <strong>{b}</strong> and
      place them near the triumph track.
    </Typography>
  );
}
