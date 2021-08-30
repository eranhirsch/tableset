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
import playersSlice, { Player } from "../players/playersSlice";
import PlayerColors from "../../common/PlayerColors";
import Game from "../../games/Game";
import GameMapper, { GameId } from "../../games/GameMapper";

type ConstantTemplateElement<T> =
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

export type TemplateElement<T> =
  | ConstantTemplateElement<T>
  | {
      id: T;
      strategy: Exclude<Strategy, Strategy.FIXED>;
    };

const templateAdapter = createEntityAdapter<TemplateElement<SetupStepName>>({
  selectId: (step) => step.id,
});

function fixedSetupStep(
  id: "firstPlayer",
  game: Game,
  playerIds: EntityId[]
): ConstantTemplateElement<"firstPlayer">;
function fixedSetupStep(
  id: "playOrder",
  game: Game,
  playerIds: EntityId[]
): ConstantTemplateElement<"playOrder">;
function fixedSetupStep(
  id: "playerColors",
  game: Game,
  playerIds: EntityId[]
): ConstantTemplateElement<"playerColors">;
function fixedSetupStep(
  id: SetupStepName,
  game: Game,
  playerIds: EntityId[]
): ConstantTemplateElement<SetupStepName>;
function fixedSetupStep(
  id: any,
  game: Game,
  playerIds: EntityId[]
): ConstantTemplateElement<SetupStepName> {
  switch (id) {
    case "playOrder": {
      // Remove the first player which would be used as a pivot
      const [, ...restOfPlayers] = playerIds;
      return {
        id: "playOrder",
        strategy: Strategy.FIXED,
        value: restOfPlayers,
      };
    }

    case "firstPlayer": {
      return {
        id: "firstPlayer",
        strategy: Strategy.FIXED,
        value: playerIds[0],
      };
    }

    case "playerColors":
      return {
        id: "playerColors",
        strategy: Strategy.FIXED,
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
        value: ConcordiaGame.itemsForStep(id)[0],
      };
  }
}

export const templateSlice = createSlice({
  name: "template",
  initialState: templateAdapter.getInitialState(),
  reducers: {
    enabled(
      state,
      {
        payload: { id, strategy },
      }: PayloadAction<{
        id: SetupStepName;
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
      prepare: (gameId: GameId, id: SetupStepName, playersTotal: number) => ({
        payload: id,
        meta: { gameId, playersTotal },
      }),
      reducer(
        state,
        {
          payload: id,
          meta: { gameId, playersTotal },
        }: PayloadAction<
          SetupStepName,
          any,
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
      prepare(id: SetupStepName, gameId: GameId, playerIds: EntityId[]) {
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
          SetupStepName,
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
      }: PayloadAction<Omit<ConstantTemplateElement<SetupStepName>, "strategy">>
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
                } else if (step.strategy === Strategy.FIXED) {
                  const playerIndex = step.value.indexOf(playerId);
                  invariant(playerIndex !== -1);
                  step.value.splice(playerIndex, 1);
                }
                break;

              case "playerColors":
                if (step.strategy === Strategy.FIXED) {
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

export const selectors = templateAdapter.getSelectors<RootState>(
  (state) => state.template
);

export default templateSlice;
