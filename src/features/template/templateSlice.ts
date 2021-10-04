import {
  createEntityAdapter,
  createSelector,
  createSlice,
  PayloadAction
} from "@reduxjs/toolkit";
import { RootState } from "app/store";
import { nullthrows, Vec } from "common";
import { playersActions } from "features/players/playersSlice";
import { Strategy } from "features/template/Strategy";
import GameMapper, { GameId } from "games/core/GameMapper";
import { PLAYERS_DEPENDENCY_META_STEP_ID } from "games/core/steps/createPlayersDependencyMetaStep";
import { StepId } from "model/IGame";
import { TemplateContext } from "model/IGameStep";

type ConstantTemplateElement = Readonly<{
  strategy: Strategy.FIXED;
  value: unknown;
}>;

export type TemplateElement = { id: StepId; isStale: boolean } & (
  | ConstantTemplateElement
  | Readonly<{
      strategy: Exclude<Strategy, Strategy.FIXED>;
    }>
);

const templateAdapter = createEntityAdapter<TemplateElement>({
  selectId: (step) => step.id,
});

interface GlobalTemplateState {
  gameId: GameId;
}

const INITIAL_GLOBAL_STATE: GlobalTemplateState = { gameId: "concordia" };

const templateSlice = createSlice({
  name: "template",
  initialState: templateAdapter.getInitialState(INITIAL_GLOBAL_STATE),
  reducers: {
    enabled: (
      state,
      action: PayloadAction<
        TemplateElement & {
          strategy: Strategy.RANDOM | Strategy.DEFAULT | Strategy.ASK;
        }
      >
    ) => {
      templateAdapter.upsertOne(state, action);
      markDownstreamElementsStale(action.payload.id, state);
    },

    disabled(state, action: PayloadAction<StepId>) {
      templateAdapter.removeOne(state, action);
      markDownstreamElementsStale(action.payload, state);
    },

    enabledConstantValue: {
      prepare: (id: StepId, context: Omit<TemplateContext, "template">) => ({
        payload: id,
        meta: context,
      }),

      reducer(
        state,
        {
          payload: id,
          meta: context,
        }: PayloadAction<StepId, string, Omit<TemplateContext, "template">>
      ) {
        templateAdapter.upsertOne(state, {
          id,
          strategy: Strategy.FIXED,
          isStale: false,
          value: GameMapper.forId(state.gameId).atEnforce(id)
            .initialFixedValue!({ ...context, instance: [] }),
        });

        markDownstreamElementsStale(id, state);
      },
    },

    constantValueChanged(
      state,
      { payload: { id, value } }: PayloadAction<{ id: StepId; value: unknown }>
    ) {
      const element = nullthrows(
        state.entities[id],
        `Couldn't find step: ${id}, This action is only supported on elements which are already in the template`
      );

      if (element.strategy !== Strategy.FIXED) {
        throw new Error(
          `Trying to set fixed value when strategy isn't fixed for step: ${id}`
        );
      }

      element.value = value;

      markDownstreamElementsStale(id, state);
    },

    refresh: (
      state,
      { payload: context }: PayloadAction<Omit<TemplateContext, "template">>
    ) => {
      const game = GameMapper.forId(state.gameId);
      game.steps.forEach((step) => {
        const element = state.entities[step.id];
        if (element == null) {
          // Nothing to update
          return;
        }

        if (!element.isStale) {
          return;
        }

        if (step.strategies == null) {
          // No strategies method, this might be so rare or impossible it should
          // be an invariant/nullthrows and not a regular condition.
          templateAdapter.removeOne(state, step.id);
          return;
        }

        const strategies = step.strategies({
          ...context,
          template: state.entities,
        });

        if (!strategies.includes(element.strategy)) {
          // The step is no longer valid in it's current configuration
          templateAdapter.removeOne(state, step.id);
          return;
        }

        if (
          element.strategy === Strategy.FIXED &&
          step.refreshFixedValue != null
        ) {
          const newValue = step.refreshFixedValue(element.value, context);
          if (newValue != null) {
            element.value = newValue;
            element.isStale = false;
          } else {
            templateAdapter.removeOne(state, step.id);
          }
        }
      });
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(playersActions.added, (state) =>
        markDownstreamElementsStale(PLAYERS_DEPENDENCY_META_STEP_ID, state)
      )
      .addCase(playersActions.removed, (state) =>
        markDownstreamElementsStale(PLAYERS_DEPENDENCY_META_STEP_ID, state)
      );
  },
});
export default templateSlice;

export const templateSelectors = templateAdapter.getSelectors<RootState>(
  (state) => state.template
);

export const templateIsStaleSelector = createSelector(
  templateSelectors.selectAll,
  (elements) => elements.some(({ isStale }) => isStale)
);

export const templateActions = templateSlice.actions;

function markDownstreamElementsStale(
  changedElementId: StepId,
  { gameId, entities }: RootState["template"]
): void {
  const { steps } = GameMapper.forId(gameId);
  const downstreamSteps = steps.filter((x) =>
    x.dependencies?.some(({ id }) => id === changedElementId)
  );
  const downstreamElements = Vec.filter_nulls(
    downstreamSteps.map(({ id }) => entities[id])
  );
  downstreamElements.forEach((element) => (element.isStale = true));
}
