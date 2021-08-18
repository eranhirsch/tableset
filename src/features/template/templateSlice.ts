import {
  createEntityAdapter,
  createSlice,
  EntityId,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import invariant, { type_invariant } from "../../common/err/invariant";
import nullthrows from "../../common/err/nullthrows";
import filter_nulls from "../../common/lib_utils/filter_nulls";
import ConcordiaGame, {
  SetupStepName,
} from "../../core/games/concordia/ConcordiaGame";
import { Strategy } from "../../core/Strategy";
import { GamePiecesColor } from "../../core/themeWithGameColors";
import {
  removed as playerRemoved,
  added as playerAdded,
  Player,
} from "../players/playersSlice";

export interface PlayerColors {
  [playerId: string]: GamePiecesColor;
}

export type SetupStep<T> =
  | {
      id: "playOrder";
      strategy: Strategy.FIXED;
      value?: EntityId[];
      previous?: SetupStep<T>;
    }
  | {
      id: "playerColor";
      strategy: Strategy.FIXED;
      value?: PlayerColors;
      previous?: SetupStep<T>;
    }
  | {
      id: T;
      strategy: Strategy;
      value?: string;
      previous?: SetupStep<T>;
    };

const templateAdapter = createEntityAdapter<SetupStep<SetupStepName>>({
  selectId: (step) => step.id,
});

export const templateSlice = createSlice({
  name: "template",
  initialState: templateAdapter.getInitialState(),
  reducers: {
    strategySwapped(
      state,
      {
        payload: { id, strategy },
      }: PayloadAction<{ id: EntityId; strategy: Strategy }>
    ) {
      if (!(id in state.entities)) {
        state = templateAdapter.addOne(state, {
          id: id as SetupStepName,
          strategy: Strategy.OFF,
        });
      }
      const step = nullthrows(state.entities[id]);

      invariant(
        step.strategy !== strategy,
        `For step '${id}' trying to swap strategies with the same strategy ${strategy}`
      );
      if (strategy !== Strategy.OFF) {
        step.strategy = strategy;
      } else {
        state = templateAdapter.removeOne(state, id);
      }

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

      let checkChanges = true;
      while (checkChanges) {
        checkChanges = filter_nulls(Object.values(state.entities))
          .filter((step) => step.id !== id)
          .some((step) => {
            const strategies = ConcordiaGame.strategiesFor(
              step.id,
              state.entities
            );

            if (
              step.previous != null &&
              strategies.includes(step.previous.strategy)
            ) {
              step.strategy = step.previous.strategy;
              step.value = step.previous.value;
              step.previous = undefined;
              return true;
            }

            if (!strategies.includes(step.strategy)) {
              step.previous = { ...step };
              step.strategy = nullthrows(strategies[0]);
              step.value = undefined;
              return true;
            }

            return false;
          });
      }
    },

    fixedValueSet(
      state,
      {
        payload: { stepId, value },
      }: PayloadAction<
        | { stepId: EntityId; value: string }
        | { stepId: "playOrder"; value: EntityId[] }
        | { stepId: "playerColor"; value: PlayerColors }
      >
    ) {
      const step = state.entities[stepId];
      if (step == null) {
        throw new Error(`Couldn't find setup step ${stepId}`);
      }

      if (step.strategy !== Strategy.FIXED) {
        throw new Error(
          `Trying to set fixed value when strategy isn't fixed for setup step ${stepId}`
        );
      }

      step.value = value;
    },

    initialized: templateAdapter.setAll,
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        playerRemoved,
        (state, { payload: playerId }: PayloadAction<EntityId>) => {
          // When the player order is fixed we need to remove the removed player
          // from it too, so that the play order represents the current players.
          // TODO: We need to generalize it to work dynamically on all player-
          // related steps
          const { playOrder } = state.entities;
          if (
            playOrder != null &&
            playOrder.strategy === Strategy.FIXED &&
            playOrder.value != null
          ) {
            const value = type_invariant<EntityId[]>(
              playOrder.value,
              Array.isArray
            );
            const playerIndex = value.indexOf(playerId);
            invariant(playerIndex !== -1);
            value.splice(playerIndex, 1);
          }
        }
      )
      .addCase(
        playerAdded,
        (state, { payload: player }: PayloadAction<Player>) => {
          // When the player order is fixed we need to add the added player to
          // it too, so that the play order represents the current players.
          // TODO: We need to generalize it to work dynamically on all player-
          // related steps
          const { playOrder } = state.entities;
          if (
            playOrder != null &&
            playOrder.strategy === Strategy.FIXED &&
            playOrder.value != null
          ) {
            const value = type_invariant<EntityId[]>(
              playOrder.value,
              Array.isArray
            );
            value.push(player.name);
          }
        }
      );
  },
});

export const selectors = templateAdapter.getSelectors<RootState>(
  (state) => state.template
);

export default templateSlice;
