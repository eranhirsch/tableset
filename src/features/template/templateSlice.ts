import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import {
  availableStrategies,
  initialTemplate,
  SetupStepName,
} from "../../core/games/concordia/SetupStep";
import { Strategy } from "../../core/Strategy";

export type SetupStep<T> = {
  name: T;
  strategy: Strategy;
  value?: string;
  previous?: SetupStep<T>;
};

interface Player {
  name: string;
}

export type TemplateState = {
  steps: SetupStep<SetupStepName>[];
  players: Player[];
};

function nextStrategyImpl(
  { steps }: TemplateState,
  { payload: name }: PayloadAction<SetupStepName>
) {
  // Find the setup step in the template
  const stepIdx = steps.findIndex((step) => step.name === name);
  if (stepIdx === -1) {
    throw new Error(`Couldn't find setup step ${name}`);
  }
  const step = steps[stepIdx];

  if (step.strategy === Strategy.FIXED && step.value != null) {
    // The UI prevents this from happening, but we should also make sure the
    // backend is protected
    throw new Error(
      `Cannot change strategy for ${name} while fixed to ${step.value}`
    );
  }

  // Compute the next available strategy for the step
  const strategies = availableStrategies(name, steps);
  const currentStrategyIdx = strategies.indexOf(step.strategy);
  if (currentStrategyIdx === -1) {
    throw new Error(
      `Couldn't find strategy ${step.strategy} in available strategies ${strategies} for setup step ${name}`
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
  steps.slice(stepIdx + 1).forEach((step) => {
    const strategies = availableStrategies(step.name, steps);

    if (step.previous != null && strategies.includes(step.previous.strategy)) {
      step.strategy = step.previous.strategy;
      step.value = step.previous.value;
      step.previous = undefined;
    } else if (!strategies.includes(step.strategy)) {
      step.previous = { ...step };
      step.strategy = strategies[0]!;
      step.value = undefined;
    }
  });
}

function definedFixedStrategyImpl(
  { steps }: TemplateState,
  {
    payload: { name, value },
  }: PayloadAction<{ name: SetupStepName; value?: string }>
) {
  const setupStep = steps.find((step) => step.name === name);
  if (setupStep == null) {
    throw new Error(`Couldn't find setup step ${name}`);
  }

  if (setupStep.strategy !== Strategy.FIXED) {
    throw new Error(
      `Trying to set fixed value when strategy isn't fixed for setup step ${setupStep}`
    );
  }

  setupStep.value = value;
}

function addPlayerImpl(
  { players }: TemplateState,
  { payload: name }: PayloadAction<string>
) {
  const normalized = name.trim();
  if (normalized.length === 0) {
    return;
  }

  if (players.some(({ name }) => normalized === name)) {
    // Duplicate name
    return;
  }

  players.push({ name });
}

function removePlayerImpl(
  { players }: TemplateState,
  { payload: removedName }: PayloadAction<string>
) {
  const playerIdx = players.findIndex(({ name }) => name === removedName);
  players.splice(playerIdx, 1);
}

export const templateSlice = createSlice({
  name: "template",
  initialState: {
    steps: initialTemplate,
    players: [
      { name: "Eran Hirsch" },
      { name: "Amit Cwajgahaft" },
      { name: "Adam Maoz" },
    ],
  },
  reducers: {
    nextStrategy: nextStrategyImpl,
    defineFixedStrategy: definedFixedStrategyImpl,
    addPlayer: addPlayerImpl,
    removePlayer: removePlayerImpl,
  },
});

export const { nextStrategy, defineFixedStrategy, addPlayer, removePlayer } =
  templateSlice.actions;

export const selectTemplate = (state: RootState) => state.template;

export default templateSlice.reducer;
