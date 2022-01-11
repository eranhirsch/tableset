import { Stack, Typography } from "@mui/material";
import { $, Random, Vec } from "common";
import { InstanceCard } from "features/instance/InstanceCard";
import {
  createRandomGameStep,
  InstanceCardsProps,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { NoConfigPanel } from "games/core/steps/NoConfigPanel";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";

const ALL_GOAL_IDS = [
  "birdsInForest",
  "birdsInGrasslands",
  "birdsInWetlands",
  "birdsWithEggsBowl",
  "birdsWithEggsCavity",
  "birdsWithEggsGround",
  "birdsWithEggsPlatform",
  "eggsInBowl",
  "eggsInCavity",
  "eggsInForest",
  "eggsInGrassLands",
  "eggsInGround",
  "eggsInPlatform",
  "eggsInWetlands",
  "setsOfEggs",
  "totalBirds",
] as const;
type GoalId = typeof ALL_GOAL_IDS[number];
const TILES: readonly (readonly [GoalId, GoalId])[] = [
  ["birdsInForest", "eggsInForest"],
  ["birdsInGrasslands", "eggsInGrassLands"],
  ["birdsInWetlands", "eggsInWetlands"],
  ["birdsWithEggsBowl", "eggsInBowl"],
  ["birdsWithEggsCavity", "eggsInCavity"],
  ["birdsWithEggsGround", "eggsInGround"],
  ["birdsWithEggsPlatform", "eggsInPlatform"],
  ["setsOfEggs", "totalBirds"],
];

const GOAL_NAMES: Readonly<Required<Record<GoalId, string>>> = {
  birdsInForest: "Birds in The Forest Row",
  birdsInGrasslands: "Birds in The Grassland Row",
  birdsInWetlands: "Birds in The Wetland Row",
  birdsWithEggsBowl: "Bowl Nesting Birds with Eggs",
  birdsWithEggsCavity: "Cavity Nesting Birds with Eggs",
  birdsWithEggsGround: "Ground Nesting Birds with Eggs",
  birdsWithEggsPlatform: "Platform Nesting Birds with Eggs",
  eggsInBowl: "Eggs in Bowl Nests",
  eggsInCavity: "Eggs in Cavity Nests",
  eggsInGround: "Eggs in Ground Nests",
  eggsInPlatform: "Eggs in Platform Nests",
  eggsInForest: "Eggs in The Forest Row",
  eggsInGrassLands: "Eggs in The Grassland Row",
  eggsInWetlands: "Eggs in The Wetland Row",
  totalBirds: "Total number of Birds",
  setsOfEggs: "Sets of Eggs in All Rows",
};
const NUM_GOALS_IN_GAME = 4;

export default createRandomGameStep({
  id: "goalTiles",
  dependencies: [],
  isTemplatable: () => true,
  resolve: () =>
    $(
      TILES,
      ($$) => Random.sample($$, NUM_GOALS_IN_GAME),
      ($$) => Vec.map($$, Random.sample_1),
      Random.shuffle
    ),
  InstanceVariableComponent,
  InstanceCards,
  InstanceManualComponent,
  instanceAvroType: {
    type: "array",
    items: { type: "enum", name: "GoalId", symbols: [...ALL_GOAL_IDS] },
  },

  // TODO: We can use the item selector to at least give the ability to mark
  // specific goals as required or banned, but because we don't have a widget
  // for picking an order (I want goal X to be the 3rd) it might not be valuable
  // enough on it's own
  ...NoConfigPanel,
});

function InstanceVariableComponent({
  value: goalIds,
}: VariableStepInstanceComponentProps<readonly GoalId[]>): JSX.Element {
  return (
    <>
      <Typography variant="body1" textAlign="justify">
        Put the following goal tiles on the blank spaces on the goal board in
        the following order; <em>returning the rest of the tiles to the box</em>
        :
      </Typography>
      <Stack spacing={1} marginTop={2} paddingX={2}>
        {Vec.map(goalIds, (goalId) => (
          <Typography key={goalId} variant="body2">
            <strong>{GOAL_NAMES[goalId]}</strong>
          </Typography>
        ))}
      </Stack>
    </>
  );
}

function InstanceCards({
  value: goalIds,
  onClick,
}: InstanceCardsProps<readonly GoalId[]>): JSX.Element {
  return (
    <>
      {Vec.map(goalIds, (goalId, index) => (
        <InstanceCard
          key={goalId}
          onClick={onClick}
          title="Goal"
          subheader={
            // TODO: This is ugly
            index === 0
              ? "1st"
              : index === 1
              ? "2nd"
              : index === 2
              ? "3rd"
              : "4th"
          }
        >
          <Typography variant="subtitle2" color="primary">
            <strong>{GOAL_NAMES[goalId]}</strong>
          </Typography>
        </InstanceCard>
      ))}
    </>
  );
}

function InstanceManualComponent(): JSX.Element {
  return (
    <HeaderAndSteps>
      <>
        Shuffle the goal tiles without looking at them (they're double-sided).
      </>
      <>
        Place <strong>1</strong> goal tile (random side up) on each of the{" "}
        {NUM_GOALS_IN_GAME} blank spaces on the goal board.
      </>
      <>Return the extra goal tiles to the box.</>
    </HeaderAndSteps>
  );
}
