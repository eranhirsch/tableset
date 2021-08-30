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
import { Strategy } from "../../core/Strategy";
import playersSlice, { Player } from "../players/playersSlice";
import PlayerColors from "../../common/PlayerColors";
import Game, { StepId } from "../../games/IGame";
import GameMapper, { GameId } from "../../games/GameMapper";

type ConstantTemplateElement =
  | {
      id: "playOrder";
      strategy: Strategy.FIXED;
      global: true;
      value: EntityId[];
    }
  | {
      id: "playerColors";
      strategy: Strategy.FIXED;
      global: true;
      value: PlayerColors;
    }
  | {
      id: "firstPlayer";
      strategy: Strategy.FIXED;
      global: true;
      value: EntityId;
    }
  | {
      id: StepId;
      strategy: Strategy.FIXED;
      global: false;
      value: string;
    };

export type TemplateElement =
  | ConstantTemplateElement
  | {
      id: StepId;
      strategy: Exclude<Strategy, Strategy.FIXED>;
    };

const templateAdapter = createEntityAdapter<TemplateElement>({
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
      prepare: (gameId: GameId, id: StepId, playersTotal: number) => ({
        payload: id,
        meta: { gameId, playersTotal },
      }),
      reducer(
        state,
        {
          payload: id,
          meta: { gameId, playersTotal },
        }: PayloadAction<
          StepId,
          string,
          { gameId: GameId; playersTotal: number }
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
          ).filter(
            (step) =>
              !GameMapper.forId(gameId)
                .strategiesFor(step.id, currentEntities, playersTotal)
                .includes(step.strategy)
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
    },

    enabledConstantValue: {
      prepare(id: StepId, gameId: GameId, playerIds: EntityId[]) {
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
          { playerIds: EntityId[]; gameId: GameId }
        >
      ) {
        templateAdapter.upsertOne(
          state,
          fixedSetupStep(id, GameMapper.forId(gameId), playerIds)
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
            payload: playerId,
            meta: playersTotal,
          }: PayloadAction<EntityId, any, number>
        ) =>
          filter_nulls(Object.values(state.entities)).forEach((step) => {
            switch (step.id) {
              case "playOrder":
                if (playersTotal >= 3) {
                  // When we only have 2 players there is no sense in play order
                  state = templateAdapter.removeOne(state, "playOrder");
                } else if (step.strategy === Strategy.FIXED && step.global) {
                  const playerIndex = step.value.indexOf(playerId);
                  invariant(playerIndex !== -1);
                  step.value.splice(playerIndex, 1);
                }
                break;

              case "playerColors":
                if (step.strategy === Strategy.FIXED && step.global) {
                  delete step.value[playerId];
                }
                break;

              case "firstPlayer":
                if (step.strategy === Strategy.FIXED) {
                  state = templateAdapter.removeOne(state, "firstPlayer");
                }
                break;
            }
          })
      )

      .addCase(
        playersSlice.actions.added,
        (
          state,
          {
            payload: player,
            meta: gameId,
          }: PayloadAction<Player, string, GameId>
        ) =>
          filter_nulls(Object.values(state.entities)).forEach((step) => {
            if (step.strategy !== Strategy.FIXED) {
              return;
            }

            if (!step.global) {
              return;
            }

            switch (step.id) {
              case "playOrder":
                step.value.push(player.name);
                break;

              case "playerColors":
                const usedColors = Object.values(step.value);
                step.value[player.name] = nullthrows(
                  GameMapper.forId(gameId).playerColors.find(
                    (color) => !usedColors.includes(color)
                  )
                );
                break;
            }
          })
      );
  },
});
export default templateSlice;

export const selectors = templateAdapter.getSelectors<RootState>(
  (state) => state.template
);

function fixedSetupStep(
  id: StepId,
  game: Game,
  playerIds: EntityId[]
): ConstantTemplateElement {
  switch (id) {
    case "playOrder": {
      // Remove the first player which would be used as a pivot
      const [, ...restOfPlayers] = playerIds;
      return {
        id: "playOrder",
        strategy: Strategy.FIXED,
        global: true,
        value: restOfPlayers,
      };
    }

    case "firstPlayer": {
      return {
        id: "firstPlayer",
        strategy: Strategy.FIXED,
        global: true,
        value: playerIds[0],
      };
    }

    case "playerColors":
      return {
        id: "playerColors",
        strategy: Strategy.FIXED,
        global: true,
        value: Object.fromEntries(
          playerIds.map((playerId, index) => [
            playerId,
            game.playerColors[index],
          ])
        ),
      };

    default:
      return {
        id: id,
        strategy: Strategy.FIXED,
        global: false,
        value: game.at(id)!.items![0],
      };
  }
}
