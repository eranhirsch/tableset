import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import filter_nulls from "../../common/lib_utils/filter_nulls";
import { Strategy } from "../../core/Strategy";
import playersSlice, { Player, PlayerId } from "../players/playersSlice";
import GameMapper, { GameId } from "../../games/core/GameMapper";
import AppContext from "../../app/AppContext";
import { StepId } from "../../games/core/IGame";

export type ConstantTemplateElement = Readonly<{
  id: StepId;
  strategy: Strategy.FIXED;
  value: any;
}>;

export type TemplateElement =
  | ConstantTemplateElement
  | Readonly<{
      id: StepId;
      strategy: Exclude<Strategy, Strategy.FIXED>;
    }>;

export const templateAdapter = createEntityAdapter<TemplateElement>({
  selectId: (step) => step.id,
});

export const templateSlice = createSlice({
  name: "template",
  initialState: templateAdapter.getInitialState(),
  reducers: {
    enabled(
      state,
      {
        payload: { id, strategy },
      }: PayloadAction<{
        id: StepId;
        strategy:
          | Strategy.RANDOM
          | Strategy.DEFAULT
          | Strategy.ASK
          | Strategy.COMPUTED;
      }>
    ) {
      const step = state.entities[id];
      if (step == null) {
        templateAdapter.addOne(state, { id, strategy });
      } else {
        step.strategy = strategy;
      }
    },

    disabled: {
      prepare: (
        gameId: GameId,
        id: StepId,
        playerIds: readonly PlayerId[]
      ) => ({
        payload: id,
        meta: { gameId, playerIds },
      }),
      reducer(
        state,
        {
          payload: id,
          meta: { gameId, playerIds },
        }: PayloadAction<
          StepId,
          string,
          { gameId: GameId; playerIds: readonly PlayerId[] }
        >
      ) {
        state = templateAdapter.removeOne(state, id);

        // When strategies change they might make strategies for downstream steps
        // invalid so we go over all of them and fix any inconsistency.
        // BUT... because we only provide the user with a 'next strategy' action,
        // they might not be aware of this and thus a click would cause them to
        // lose these configurations unintentionally. To solve that we save the
        // previous config, and, when a change upstream makes the previous config
        // valid again, we swap it back in.

        while (true) {
          const currentEntities = { ...state.entities };
          const invalidSteps = filter_nulls(
            Object.values(state.entities)
          ).filter((step) => {
            const strategiesFunc = GameMapper.forId(gameId).at(
              step.id
            )!.strategies;
            return strategiesFunc == null
              ? true
              : !strategiesFunc({
                  template: currentEntities,
                  playerIds,
                }).includes(step.strategy);
          });

          if (invalidSteps.length === 0) {
            break;
          }

          state = templateAdapter.removeMany(
            state,
            invalidSteps.map((step) => step.id)
          );
        }
      },
    },

    enabledConstantValue: {
      prepare(id: StepId, gameId: GameId, playerIds: PlayerId[]) {
        return {
          payload: id,
          meta: { playerIds, gameId },
        };
      },
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
        templateAdapter.upsertOne(
          state,
          GameMapper.forId(gameId).at(id)!.initialFixedValue!(playerIds)
        );
      },
    },

    constantValueChanged(
      state,
      {
        payload: { id, value },
      }: PayloadAction<Omit<ConstantTemplateElement, "strategy">>
    ) {
      const step = state.entities[id];
      if (step == null) {
        throw new Error(`Couldn't find setup step ${id}`);
      }

      if (step.strategy !== Strategy.FIXED) {
        throw new Error(
          `Trying to set fixed value when strategy isn't fixed for setup step ${id}`
        );
      }

      step.value = value;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(
        playersSlice.actions.removed,
        (
          state,
          {
            payload: removedPlayerId,
            meta: { playersTotal, gameId },
          }: PayloadAction<PlayerId, any, AppContext>
        ) =>
          Object.values(state.ids).forEach((stepId) => {
            const gameStep = GameMapper.forId(gameId).at(stepId as StepId);
            if (gameStep?.onPlayerRemoved != null) {
              gameStep.onPlayerRemoved(state, {
                removedPlayerId,
                playersTotal,
              });
            }
          })
      )

      .addCase(
        playersSlice.actions.added,
        (
          state,
          {
            payload: addedPlayer,
            meta: gameId,
          }: PayloadAction<Player, string, GameId>
        ) =>
          Object.values(state.ids).forEach((stepId) => {
            const gameStep = GameMapper.forId(gameId).at(stepId as StepId);
            if (gameStep?.onPlayerAdded != null) {
              gameStep.onPlayerAdded(state, { addedPlayer });
            }
          })
      );
  },
});
export default templateSlice;

export type TemplateState = ReturnType<typeof templateSlice["reducer"]>;

export const selectors = templateAdapter.getSelectors<RootState>(
  (state) => state.template
);
