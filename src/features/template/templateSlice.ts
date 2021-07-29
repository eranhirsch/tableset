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

export interface SetupStep<T> {
  name: T;
  strategy: Strategy;
}

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
      const setupStep = state.steps.find(
        (step) => (step.name = action.payload)
      );
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
  },
});

export const { nextStrategy } = templateSlice.actions;

export const selectSetupSteps = (state: RootState) => state.template.steps;

export default templateSlice.reducer;
