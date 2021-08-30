import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import nullthrows from "../../common/err/nullthrows";
import filter_nulls from "../../common/lib_utils/filter_nulls";
import { Strategy } from "../../core/Strategy";
import playersSlice, { Player, PlayerId } from "../players/playersSlice";
import PlayerColors from "../../common/PlayerColors";
import Game, { StepId } from "../../games/IGame";
import GameMapper, { GameId } from "../../games/GameMapper";
import AppContext from "../../app/AppContext";
import PlayOrderStep from "../../games/steps/PlayOrderStep";
import PlayerColorsStep from "../../games/steps/PlayerColorsStep";
import FirstPlayerStep from "../../games/steps/FirstPlayerStep";

type ConstantTemplateElement =
  | {
      id: PlayOrderStep["id"];
      strategy: Strategy.FIXED;
      global: true;
      value: PlayerId[];
    }
  | {
      id: PlayerColorsStep["id"];
      strategy: Strategy.FIXED;
      global: true;
      value: PlayerColors;
    }
  | {
      id: FirstPlayerStep["id"];
      strategy: Strategy.FIXED;
      global: true;
      value: PlayerId;
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
          ).filter((step) => {
            const strategiesFunc = GameMapper.forId(gameId).at(
              step.id
            )!.strategies;
            return strategiesFunc == null
              ? true
              : !strategiesFunc({
                  template: currentEntities,
                  playersTotal,
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
            meta: { playersTotal, gameId },
          }: PayloadAction<PlayerId, any, AppContext>
        ) => {
          const game = GameMapper.forId(gameId);
          Object.values(state.ids).forEach((stepId) => {
            const gameStep = game.at(stepId as StepId);
            if (gameStep?.onPlayerRemoved != null) {
              gameStep.onPlayerRemoved(state, playerId, playersTotal);
            }
          });
        }
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
                step.value.push(player.id);
                break;

              case "playerColors":
                const usedColors = Object.values(step.value);
                step.value[player.id] = nullthrows(
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
  playerIds: PlayerId[]
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
