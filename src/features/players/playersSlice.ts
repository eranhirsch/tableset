import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface Player {
  name: string;
}

const playersAdapter = createEntityAdapter<Player>({
  selectId: (player) => player.name,
});

const playersSlice = createSlice({
  name: "players",
  initialState: playersAdapter.getInitialState(),
  reducers: {
    initialized: playersAdapter.setAll,
    added: playersAdapter.addOne,
    removed: playersAdapter.removeOne,
  },
});

export const selectors = playersAdapter.getSelectors<RootState>(
  (state) => state.players
);

export default playersSlice;
