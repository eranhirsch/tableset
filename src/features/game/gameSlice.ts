import { createSelector, createSlice } from "@reduxjs/toolkit";
import { nullthrows, Vec } from "common";
import { StepId } from "model/Game";
import { GameStepBase } from "model/GameStepBase";
import { RootState } from "../../app/store";
import { GameId, GAMES } from "../../games/core/GAMES";

interface GameState {
  id: GameId;
}

const initialState: GameState = { id: "concordia" };

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {},
});

const gameIdSelector = (state: RootState) => state.game.id;
export const gameSelector = createSelector(
  gameIdSelector,
  (gameId) => GAMES[gameId]
);
export const gameStepsSelector = createSelector(
  gameSelector,
  (game) => game.steps
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