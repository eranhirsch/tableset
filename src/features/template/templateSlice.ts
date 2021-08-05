import {
  createEntityAdapter,
  createSlice,
  EntityId,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import filter_nulls from "../../common/filter_nulls";
import {
  availableStrategies,
  SetupStepName,
} from "../../core/games/concordia/SetupStep";
import { Strategy } from "../../core/Strategy";

export type SetupStep<T> = {
  name: T;
  strategy: Strategy;
  value?: string;
  previous?: SetupStep<T>;
};

const templateAdapter = createEntityAdapter<SetupStep<SetupStepName>>({
  selectId: (step) => step.name,
});

export const templateSlice = createSlice({
  name: "template",
  initialState: templateAdapter.getInitialState(),
  reducers: {
    strategySwapped(state, { payload: stepId }: PayloadAction<EntityId>) {
      // Find the setup step in the template
      const step = state.entities[stepId];
      if (step == null) {
        throw new Error(`Couldn't find setup step ${stepId}`);
      }

      if (step.strategy === Strategy.FIXED && step.value != null) {
        // The UI prevents this from happening, but we should also make sure the
        // backend is protected
        throw new Error(
          `Cannot change strategy for ${stepId} while fixed to ${step.value}`
        );
      }

      // Compute the next available strategy for the step
      const strategies = availableStrategies(
        stepId as SetupStepName,
        state.entities
      );
      const currentStrategyIdx = strategies.indexOf(step.strategy);
      if (currentStrategyIdx === -1) {
        throw new Error(
          `Couldn't find strategy ${step.strategy} in available strategies ${strategies} for setup step ${stepId}`
        );
      }
      const nextStrategyIdx = (currentStrategyIdx + 1) % strategies.length;
      const nextStrategy = strategies[nextStrategyIdx];

      step.strategy = nextStrategy;

      // When strategies change they might make strategies for downstream steps
      // invalid so we go over all of them and fix any inconsistency.
      // BUT... because we only provide the user with a 'next strategy' action,
      // they might not be aware of this and thus a click would cause them to
      // lose these configurations unintentionally. To solve that we save the
      // previous config, and, when a change upstream makes the previous config
      // valid again, we swap it back in.

      // Remove the previous config when the user intentionally changes
      // strategies, this will prevent us from overriding it.
      step.previous = undefined;

      // We want to go over all steps downstream from the current one, but we
      // can slice out the upstream ones.
      const stepIdx = state.ids.findIndex((id) => id === stepId);
      if (stepIdx === -1) {
        throw new Error(`Couldn't find the index for step ${stepId}`);
      }

      filter_nulls(
        Object.values(state.ids)
          .slice(stepIdx + 1)
          .map((id) => state.entities[id])
      ).forEach((step) => {
        const strategies = availableStrategies(step.name, state.entities);

        if (
          step.previous != null &&
          strategies.includes(step.previous.strategy)
        ) {
          step.strategy = step.previous.strategy;
          step.value = step.previous.value;
          step.previous = undefined;
        } else if (!strategies.includes(step.strategy)) {
          step.previous = { ...step };
          step.strategy = strategies[0]!;
          step.value = undefined;
        }
      });
    },

    fixedValueSet(
      state,
      {
        payload: { stepId, value },
      }: PayloadAction<{ stepId: EntityId; value: string }>
    ) {
      const step = state.entities[stepId];
      if (step == null) {
        throw new Error(`Couldn't find setup step ${stepId}`);
      }

      if (step.strategy !== Strategy.FIXED) {
        throw new Error(
          `Trying to set fixed value when strategy isn't fixed for setup step ${stepId}`
        );
      }

      step.value = value;
    },

    fixedValueCleared(state, { payload: stepId }: PayloadAction<EntityId>) {
      const step = state.entities[stepId];
      if (step == null) {
        throw new Error(`Couldn't find setup step ${stepId}`);
      }

      if (step.strategy !== Strategy.FIXED) {
        throw new Error(
          `Trying to set fixed value when strategy isn't fixed for setup step ${stepId}`
        );
      }

      step.value = undefined;
    },

    templateInitialized: templateAdapter.setAll,
  },
  extraReducers: {
    // If we have a fixed starting player, it doesn't make sense once that player
    // is not part of the template anymore so we need to remove it.
    // TODO: We need to generalize it to work dynamically on all player-related
    // steps
    // const startingPlayerStep = steps.find(
    //   (step) => step.name === "startingPlayer"
    // );
    // if (
    //   startingPlayerStep?.strategy === Strategy.FIXED &&
    //   startingPlayerStep.value === removedName
    // ) {
    //   startingPlayerStep.value = undefined;
    // }
  },
});

export const {
  strategySwapped,
  fixedValueSet,
  fixedValueCleared,
  templateInitialized,
} = templateSlice.actions;

export const {
  selectById: selectTemplateStepById,
  selectIds: selectTemplateStepIds,
  selectEntities: selectTemplateSteps,
} = templateAdapter.getSelectors<RootState>((state) => state.template);

export default templateSlice.reducer;
