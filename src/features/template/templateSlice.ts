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
      const setupStep = state.find((step) => step.name === name);
      if (setupStep == null) {
        throw new Error(`Couldn't find setup step ${name}`);
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

      state = state.reduce((template: SetupStep<SetupStepName>[], step) => {
        const strategies = availableStrategies(step.name, template);

        if (
          step.previous != null &&
          strategies.includes(step.previous.strategy)
        ) {
          return template.concat([step.previous!]);
        }

        if (!strategies.includes(step.strategy)) {
          return template.concat([
            {
              ...step,
              strategy: strategies[0]!,
              previous: step,
            },
          ]);
        }

        return template.concat(step);
      }, []);
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
