import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import nullthrows from "../../common/err/nullthrows";
import Strategy from "../../core/Strategy";
import GameMapper, { GameId } from "../../games/core/GameMapper";
import { StepId } from "../../games/core/IGame";
import playersSlice, { PlayerId } from "../players/playersSlice";

type ConstantTemplateElement = Readonly<{
  id: StepId;
  strategy: Strategy.FIXED;
  value: unknown;
}>;

export type TemplateElement =
  | ConstantTemplateElement
  | Readonly<{
      id: StepId;
      strategy: Exclude<Strategy, Strategy.FIXED>;
    }>;

const templateAdapter = createEntityAdapter<TemplateElement>({
  selectId: (step) => step.id,
});

export default createSlice({
  name: "template",
  initialState: templateAdapter.getInitialState({ isStale: false }),
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
      state.isStale = true;
    },

    enabledConstantValue: {
      prepare: (id: StepId, gameId: GameId, playerIds: PlayerId[]) => ({
        payload: id,
        meta: { playerIds, gameId },
      }),

      reducer(
        state,
        {
          payload: id,
          meta: { playerIds, gameId },
        }: PayloadAction<
          StepId,
          string,
          { playerIds: PlayerId[]; gameId: GameId }
        >
      ) {
        templateAdapter.upsertOne(state, {
          id,
          strategy: Strategy.FIXED,
          value: GameMapper.forId(gameId).at(id)!.initialFixedValue!(playerIds),
        });
      },
    },

    constantValueChanged(
      state,
      {
        payload: { id, value },
      }: PayloadAction<Omit<ConstantTemplateElement, "strategy">>
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
          } else {
            templateAdapter.removeOne(state, step.id);
          }
        }
      });

      state.isStale = false;
    },
  },

  extraReducers: (builder) => {
    builder
      // Player changes mean that some template elements might be invalid or
      // at least require changes to their fixed values.
      .addCase(playersSlice.actions.added, (state) => {
        state.isStale = true;
      })
      .addCase(playersSlice.actions.removed, (state) => {
        state.isStale = true;
      });
  },
});

export const templateSelectors = templateAdapter.getSelectors<RootState>(
  (state) => state.template
);
export const templateIsStaleSelector = (state: RootState) =>
  state.template.isStale;
