import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

type PlayersState = { name: string }[];

const initialState: PlayersState = [
  { name: "Eran Hirsch" },
  { name: "Amit Cwajgahaft" },
  { name: "Adam Maoz" },
];

export const playersSlice = createSlice({
  name: "players",
  initialState,
  reducers: {
    addPlayer: (state, { payload: name }: PayloadAction<string>) => {
      const normalized = name.trim();
      if (normalized.length === 0) {
        return;
      }

      if (state.some(({ name }) => normalized === name)) {
        // Duplicate name
        return;
      }

      state.push({ name });
    },

    removePlayer: (state, { payload: removedName }: PayloadAction<string>) => {
      const playerIdx = state.findIndex(({ name }) => name === removedName);
      state.splice(playerIdx, 1);
    },
  },
});

export const { addPlayer, removePlayer } = playersSlice.actions;

export const selectPlayers = (state: RootState) => state.players;

export default playersSlice.reducer;
