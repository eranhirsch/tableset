import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { nullthrows, Vec } from "common";
import { GameStepBase } from "features/instance/GameStepBase";
import { Game, StepId } from "model/Game";
import { RootState } from "../../app/store";
import { GameId, GAMES } from "../../games/core/GAMES";

interface GameState {
  id?: GameId;
}

const initialState: GameState = {};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    set: {
      prepare: ({ id }: Game) => ({ payload: id }),
      reducer(state, { payload: gameId }: PayloadAction<GameId>) {
        state.id = gameId;
      },
    },
  },
});

export const gameActions = gameSlice.actions;

export const gameIdSelector = ({ game: { id } }: RootState) => id;
export const gameSelector = createSelector(
  gameIdSelector,
  (gameId) => GAMES[gameId!]
);
export const gameStepsSelector = createSelector(
  gameSelector,
  ({ steps }) => steps
);
export const gameStepSelector = (stepId: StepId) => (state: RootState) =>
  nullthrows(
    gameStepsSelector(state)[stepId],
    `Step ${stepId} in game ${state.game.id} could not be found!`
  );
export const gameStepsSelectorByType =
  <T extends GameStepBase>(typePredicate: (x: GameStepBase) => x is T) =>
  (state: RootState) =>
    Vec.filter(Vec.values(gameStepsSelector(state)), typePredicate);
