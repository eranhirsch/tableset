import {
  createAction,
  createEntityAdapter,
  createSlice,
  EntityId,
} from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

interface Player {
  name: string;
}

const playersAdapter = createEntityAdapter<Player>({
  selectId: (player) => player.name,
});

export const removed = createAction<EntityId>("removed");

const playersSlice = createSlice({
  name: "players",
  initialState: playersAdapter.getInitialState(),
  reducers: {
    added: playersAdapter.addOne,
    initialized: playersAdapter.setAll,
  },
  extraReducers: (builder) => {
    builder.addCase(removed, playersAdapter.removeOne);
  },
});

export const selectors = playersAdapter.getSelectors<RootState>(
  (state) => state.players
);

export default playersSlice;
