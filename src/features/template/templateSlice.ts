import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import {
  availableStrategies,
  SetupStepName,
} from "../../core/games/concordia/SetupStep";

export enum Strategy {
  OFF,
  DEFAULT,
  RANDOM,
  MANUAL,
  FIXED,
  COMPUTED,
}

export type SetupStep<T> = {
  name: T;
  strategy: Strategy;
  value?: string;
  previous?: SetupStep<T>;
};

type TemplateState = SetupStep<SetupStepName>[];

const initialState: TemplateState = [
  { name: "map", strategy: Strategy.OFF },
  { name: "cityTiles", strategy: Strategy.OFF },
  { name: "bonusTiles", strategy: Strategy.OFF },
];

export const templateSlice = createSlice({
  name: "template",
  initialState,
  reducers: {
    nextStrategy: (state, { payload: name }: PayloadAction<SetupStepName>) => {
      // Find the setup step in the template
      const setupStepIdx = state.findIndex((step) => step.name === name);
      if (setupStepIdx === -1) {
        throw new Error(`Couldn't find setup step ${name}`);
      }
      const setupStep = state[setupStepIdx];

      if (setupStep.strategy === Strategy.FIXED && setupStep.value != null) {
        // The UI prevents this from happening, but we should also make sure the
        // backend is protected
        throw new Error(
          `Cannot change strategy for ${name} while fixed to ${setupStep.value}`
        );
      }

      // Compute the next available strategy for the step
      const strategies = availableStrategies(name, state);
      const currentStrategyIdx = strategies.indexOf(setupStep.strategy);
      if (currentStrategyIdx === -1) {
        throw new Error(
          `Couldn't find strategy ${setupStep.strategy} in available strategies ${strategies} for setup step ${name}`
        );
      }
      const nextStrategyIdx = (currentStrategyIdx + 1) % strategies.length;
      const nextStrategy = strategies[nextStrategyIdx];

      setupStep.strategy = nextStrategy;

      // When strategies change they might make strategies for downstream steps
      // invalid so we go over all of them and fix any inconsistency.
      // BUT... because we only provide the user with a 'next strategy' action,
      // they might not be aware of this and thus a click would cause them to
      // lose these configurations unintentionally. To solve that we save the
      // previous config, and, when a change upstream makes the previous config
      // valid again, we swap it back in.

      // Remove the previous config when the user intentionally changes
      // strategies, this will prevent us from overriding it.
      setupStep.previous = undefined;

      // We want to go over all steps downstream from the current one, but we
      // can slice out the upstream ones.
      state.slice(setupStepIdx + 1).forEach((step) => {
        const strategies = availableStrategies(step.name, state);

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

    defineFixedStrategy: (
      state,
      {
        payload: { name: setupStepName, value },
      }: PayloadAction<{ name: SetupStepName; value?: string }>
    ) => {
      const setupStep = state.find((step) => (step.name = setupStepName));
      if (setupStep == null) {
        throw new Error(`Couldn't find setup step ${setupStepName}`);
      }

      if (setupStep.strategy !== Strategy.FIXED) {
        throw new Error(
          `Trying to set fixed value when strategy isn't fixed for setup step ${setupStep}`
        );
      }

      setupStep.value = value;
    },
  },
});

export const { nextStrategy, defineFixedStrategy } = templateSlice.actions;

export const selectSetupSteps = (state: RootState) => state.template;

export default templateSlice.reducer;
