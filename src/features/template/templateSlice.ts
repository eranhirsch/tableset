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
  | { name: T; strategy: Strategy.FIXED; value: string | null }
  | { name: T; strategy: Strategy.OFF; previous?: SetupStep<T> }
  | {
      name: T;
      strategy: Strategy.DEFAULT | Strategy.MANUAL | Strategy.RANDOM;
    };

interface TemplateState {
  steps: SetupStep<SetupStepName>[];
}

const initialState: TemplateState = {
  steps: [
    { name: "map", strategy: Strategy.OFF },
    { name: "cityTiles", strategy: Strategy.OFF },
  ],
};

export const templateSlice = createSlice({
  name: "template",
  initialState,
  reducers: {
    nextStrategy: (state, { payload: name }: PayloadAction<SetupStepName>) => {
      // Find the setup step in the template
      const setupStep = state.steps.find((step) => step.name === name);
      if (setupStep == null) {
        throw new Error(`Couldn't find setup step ${name}`);
      }

      // Compute the next available strategy for the step
      const strategies = availableStrategies(name, state.steps);
      const currentStrategyIdx = strategies.indexOf(setupStep.strategy);
      if (currentStrategyIdx === -1) {
        throw new Error(
          `Couldn't find strategy ${setupStep.strategy} in available strategies ${strategies} for setup step ${name}`
        );
      }
      const nextStrategyIdx = (currentStrategyIdx + 1) % strategies.length;
      const nextStrategy = strategies[nextStrategyIdx];

      setupStep.strategy = nextStrategy;

      state.steps = state.steps.map((step) => {
        const strategies = availableStrategies(step.name, state.steps);

        if (!strategies.includes(step.strategy)) {
          return {
            ...step,
            strategy: Strategy.OFF,
            previous: step,
          };
        }

        if (
          step.strategy === Strategy.OFF &&
          step.previous != null &&
          strategies.includes(step.previous.strategy)
        ) {
          return step.previous;
        }

        return step;
      });
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
