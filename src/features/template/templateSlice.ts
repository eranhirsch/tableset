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
}

export type SetupStep<T> =
  | {
      name: T;
      strategy:
        | Strategy.DEFAULT
        | Strategy.OFF
        | Strategy.MANUAL
        | Strategy.RANDOM;
    }
  | { name: T; strategy: Strategy.FIXED; value: string | null };

interface TemplateState {
  steps: SetupStep<SetupStepName>[];
}

const initialState: TemplateState = {
  steps: [{ name: "map", strategy: Strategy.OFF }],
};

export const templateSlice = createSlice({
  name: "template",
  initialState,
  reducers: {
    nextStrategy: (state, action: PayloadAction<SetupStepName>) => {
      const setupStepName = action.payload;
      const strategies = availableStrategies(setupStepName);
      const setupStep = state.steps.find((step) => (step.name = setupStepName));
      if (setupStep == null) {
        throw new Error(`Couldn't find setup step ${setupStepName}`);
      }
      const currentStrategyIdx = strategies.indexOf(setupStep.strategy);
      if (currentStrategyIdx === -1) {
        throw new Error(
          `Couldn't find strategy ${setupStep.strategy} in available strategies ${strategies} for setup step ${setupStepName}`
        );
      }
      setupStep.strategy =
        strategies[(currentStrategyIdx + 1) % strategies.length];
    },

    defineFixedStrategy: (
      state,
      action: PayloadAction<{ name: SetupStepName; value: string | null }>
    ) => {
      const setupStepName = action.payload.name;
      const setupStep = state.steps.find((step) => (step.name = setupStepName));
      if (setupStep == null) {
        throw new Error(`Couldn't find setup step ${setupStepName}`);
      }
      if (setupStep.strategy !== Strategy.FIXED) {
        throw new Error(
          `Trying to set fixed value when strategy isn't fixed for setup step ${setupStep}`
        );
      }
      setupStep.value = action.payload.value;
    },
  },
});

export const { nextStrategy, defineFixedStrategy } = templateSlice.actions;

export const selectSetupSteps = (state: RootState) => state.template.steps;

export default templateSlice.reducer;
