import { createSelector, createSlice } from "@reduxjs/toolkit";
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

export const gameIdSelector = (state: RootState) => state.game.id;
export const gameSelector = createSelector(gameIdSelector, GameMapper.forId);
