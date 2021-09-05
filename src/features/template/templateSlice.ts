import {
  createEntityAdapter,
  createSlice,
  EntityState,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import nullthrows from "../../common/err/nullthrows";
import filter_nulls from "../../common/lib_utils/filter_nulls";
import Strategy from "../../core/Strategy";
import GameMapper, { GameId } from "../../games/core/GameMapper";
import { StepId } from "../../games/core/IGame";
import { PLAYERS_DEPENDENCY_META_STEP_ID } from "../../games/core/steps/createPlayersDependencyMetaStep";
import playersSlice, { PlayerId } from "../players/playersSlice";

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
          strategy:
            | Strategy.RANDOM
            | Strategy.DEFAULT
            | Strategy.ASK
            | Strategy.COMPUTED;
        }
      >
    ) => {
      templateAdapter.upsertOne(state, action);
    },

    disabled: (state, action) => {
      templateAdapter.removeOne(state, action);
      // TODO: Go over steps that are dependent on this step and mark them stale
      state.isStale = true;
    },

    enabledConstantValue: {
      prepare: (id: StepId, playerIds: PlayerId[]) => ({
        payload: id,
        meta: { playerIds },
      }),

      reducer(
        state,
        {
          payload: id,
          meta: { playerIds },
        }: PayloadAction<StepId, string, { playerIds: PlayerId[] }>
      ) {
        templateAdapter.upsertOne(state, {
          id,
          strategy: Strategy.FIXED,
          isStale: false,
          value: GameMapper.forId(state.gameId).at(id)!.initialFixedValue!(
            playerIds
          ),
        });
      },
    },

    constantValueChanged(
      state,
      { payload: { id, value } }: PayloadAction<{ id: StepId; value: unknown }>
    ) {
      const step = nullthrows(
        state.entities[id],
        `Couldn't find step: ${id}, This action is only supported on elements which are already in the template`
      );

      if (step.strategy !== Strategy.FIXED) {
        throw new Error(
          `Trying to set fixed value when strategy isn't fixed for step: ${id}`
        );
      }

      step.value = value;
    },

    refresh: (
      state,
      {
        payload: { gameId, playerIds },
      }: PayloadAction<{ gameId: GameId; playerIds: readonly PlayerId[] }>
    ) => {
      const game = GameMapper.forId(gameId);
      game.steps.forEach((step) => {
        const element = state.entities[step.id];
        if (element == null) {
          // Nothing to update
          return;
        }

        const strategies = step.strategies!({
          playerIds,
          template: state.entities,
        });

        if (!strategies.includes(element.strategy)) {
          // The step is no longer valid in it's current configuration
          templateAdapter.removeOne(state, step.id);
        } else if (
          element.strategy === Strategy.FIXED &&
          step.refreshFixedValue != null
        ) {
          const newValue = step.refreshFixedValue(element.value, playerIds);
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
      .addCase(playersSlice.actions.added, markPlayerDependentStepsStale)
      .addCase(playersSlice.actions.removed, markPlayerDependentStepsStale);
  },
});
export default templateSlice;

export const templateSelectors = templateAdapter.getSelectors<RootState>(
  (state) => state.template
);

function markPlayerDependentStepsStale({
  gameId,
  entities,
}: GlobalTemplateState & EntityState<TemplateElement>): void {
  const game = GameMapper.forId(gameId);
  filter_nulls(Object.values(entities)).forEach((element) => {
    const step = nullthrows(
      game.at(element.id),
      `Element for step id ${element.id} couldn't not be found in game ${gameId}`
    );
    if (
      step.dependencies != null &&
      step.dependencies.find(
        (dependency) => dependency.id === PLAYERS_DEPENDENCY_META_STEP_ID
      )
    ) {
      element.isStale = true;
    }
  });
}
