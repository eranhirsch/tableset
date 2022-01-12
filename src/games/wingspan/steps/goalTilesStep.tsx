import { Stack, Typography } from "@mui/material";
import { $, Random, Str, Vec } from "common";
import { InstanceCard } from "features/instance/InstanceCard";
import {
  createRandomGameStep,
  InstanceCardsProps,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { NoConfigPanel } from "games/core/steps/NoConfigPanel";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { GoalId, Goals } from "../utils/Goals";
import productsMetaStep from "./productsMetaStep";

export default createRandomGameStep({
  id: "goalTiles",
  dependencies: [productsMetaStep],
  isTemplatable: () => true,
  resolve: (_, productIds) =>
    $(
      productIds!,
      Goals.availableForProducts,
      ($$) => Random.sample($$, Goals.NUM_PER_GAME),
      ($$) => Vec.map($$, Random.sample_1),
      Random.shuffle
    ),
  InstanceVariableComponent,
  InstanceCards,
  InstanceManualComponent,
  instanceAvroType: {
    type: "array",
    items: { type: "enum", name: "GoalId", symbols: [...Goals.ALL_IDS] },
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
            <strong>{Goals.labelFor(goalId)}</strong>
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
          subheader={`${index + 1}${Str.number_suffix(index + 1)}`}
        >
          <Typography variant="subtitle2" color="primary">
            <strong>{Goals.labelFor(goalId)}</strong>
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
        {Goals.NUM_PER_GAME} blank spaces on the goal board.
      </>
      <>Return the extra goal tiles to the box.</>
    </HeaderAndSteps>
  );
}
