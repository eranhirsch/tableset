import { createSelector, createSlice } from "@reduxjs/toolkit";
import { nullthrows } from "common";
import { StepId } from "model/Game";
import { RootState } from "../../app/store";
import GameMapper, { GameId } from "../../games/core/GameMapper";

interface GameState {
  id: GameId;
}

const initialState: GameState = { id: "concordia" };

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {},
});
export default gameSlice;

const gameIdSelector = (state: RootState) => state.game.id;
export const gameSelector = createSelector(gameIdSelector, GameMapper.forId);
export const gameStepsSelector = createSelector(
  gameSelector,
  (game) => game.steps
);
export const gameStepSelector = (stepId: StepId) => (state: RootState) =>
  nullthrows(
    gameStepsSelector(state).find(({ id }) => id === stepId),
    `Step ${stepId} in game ${state.game.id} could not be found!`
  );