import {
  createEntityAdapter,
  createSlice,
  EntityId,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import invariant from "../../common/err/invariant";
import nullthrows from "../../common/err/nullthrows";
import filter_nulls from "../../common/lib_utils/filter_nulls";
import ConcordiaGame, {
  SetupStepName,
} from "../../games/concordia/ConcordiaGame";
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

type FixedSetupStep<T> =
  | {
      id: "playOrder";
      strategy: Strategy.FIXED;
      value: EntityId[];
    }
  | {
      id: "playerColors";
      strategy: Strategy.FIXED;
      value: PlayerColors;
    }
  | {
      id: "firstPlayer";
      strategy: Strategy.FIXED;
      value: EntityId;
    }
  | {
      id: Exclude<T, "playOrder" | "playerColors" | "firstPlayer">;
      strategy: Strategy.FIXED;
      value: string;
    };

export type SetupStep<T> =
  | FixedSetupStep<T>
  | {
      id: T;
      strategy: Exclude<Strategy, Strategy.FIXED>;
    };

const templateAdapter = createEntityAdapter<SetupStep<SetupStepName>>({
  selectId: (step) => step.id,
});

function fixedSetupStep(
  id: "firstPlayer",
  playerIds: EntityId[]
): FixedSetupStep<"firstPlayer">;
function fixedSetupStep(
  id: "playOrder",
  playerIds: EntityId[]
): FixedSetupStep<"playOrder">;
function fixedSetupStep(
  id: "playerColors",
  playerIds: EntityId[]
): FixedSetupStep<"playerColors">;
function fixedSetupStep(
  id: SetupStepName,
  playerIds: EntityId[]
): FixedSetupStep<SetupStepName>;
function fixedSetupStep(
  id: any,
  playerIds: EntityId[]
): FixedSetupStep<SetupStepName> {
  switch (id) {
    case "playOrder": {
      return { id: "playOrder", strategy: Strategy.FIXED, value: playerIds };
    }

    case "firstPlayer": {
      return {
        id: "firstPlayer",
        strategy: Strategy.FIXED,
        value: playerIds[0],
      };
    }

    case "playerColors": {
      const colors = ConcordiaGame.playerColors;
      return {
        id: "playerColors",
        strategy: Strategy.FIXED,
        value: Object.fromEntries(
          playerIds.map((playerId, index) => [playerId, colors[index]])
        ),
      };
    }

    default:
      return {
        id: id,
        strategy: Strategy.FIXED,
        value: ConcordiaGame.itemsForStep(id)[0],
      };
  }
}

export const templateSlice = createSlice({
  name: "template",
  initialState: templateAdapter.getInitialState(),
  reducers: {
    setStrategy(
      state,
      {
        payload: { id, strategy },
      }: PayloadAction<{
        id: SetupStepName;
        strategy:
          | Strategy.RANDOM
          | Strategy.DEFAULT
          | Strategy.MANUAL
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

    clearStrategy(state, { payload: id }: PayloadAction<SetupStepName>) {
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
        const invalidSteps = filter_nulls(Object.values(state.entities)).filter(
          (step) =>
            !ConcordiaGame.strategiesFor(step.id, currentEntities).includes(
              step.strategy
            )
        );

        if (invalidSteps.length === 0) {
          break;
        }

        state = templateAdapter.removeMany(
          state,
          invalidSteps.map((step) => step.id)
        );
      }
    },

    setFixedStrategy: {
      prepare(id: SetupStepName, playerIds: EntityId[]) {
        return {
          payload: id,
          meta: playerIds,
        };
      },
      reducer(
        state,
        {
          payload: id,
          meta: playerIds,
        }: PayloadAction<SetupStepName, string, EntityId[]>
      ) {
        templateAdapter.upsertOne(state, fixedSetupStep(id, playerIds));
      },
    },

    updateFixedValue(
      state,
      {
        payload: { id, value },
      }: PayloadAction<Omit<FixedSetupStep<SetupStepName>, "strategy">>
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
        playerRemoved,
        (state, { payload: playerId }: PayloadAction<EntityId>) =>
          filter_nulls(Object.values(state.entities)).forEach((step) => {
            if (step.strategy !== Strategy.FIXED) {
              return;
            }

            switch (step.id) {
              case "playOrder":
                const playerIndex = step.value.indexOf(playerId);
                invariant(playerIndex !== -1);
                step.value.splice(playerIndex, 1);
                break;

              case "playerColors":
                delete step.value[playerId];
                break;

              case "firstPlayer":
                state = templateAdapter.removeOne(state, "firstPlayer");
                break;
            }
          })
      )

      .addCase(
        playerAdded,
        (state, { payload: player }: PayloadAction<Player>) =>
          filter_nulls(Object.values(state.entities)).forEach((step) => {
            if (step.strategy !== Strategy.FIXED) {
              return;
            }

            switch (step.id) {
              case "playOrder":
                step.value.push(player.name);
                break;

              case "playerColors":
                const usedColors = Object.values(step.value);
                step.value[player.name] = nullthrows(
                  ConcordiaGame.playerColors.find(
                    (color) => !usedColors.includes(color)
                  )
                );
                break;
            }
          })
      );
  },
});

export const selectors = templateAdapter.getSelectors<RootState>(
  (state) => state.template
);

export default templateSlice;
