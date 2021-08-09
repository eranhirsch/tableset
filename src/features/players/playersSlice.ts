import {
  createAction,
  createEntityAdapter,
  createSlice,
  EntityId,
} from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface Player {
  name: string;
}

const playersAdapter = createEntityAdapter<Player>({
  selectId: (player) => player.name,
});

export const added = createAction<Player>("players/added");
export const removed = createAction<EntityId>("players/removed");

const playersSlice = createSlice({
  name: "players",
  initialState: playersAdapter.getInitialState(),
  reducers: {
    initialized: playersAdapter.setAll,
  },
  extraReducers: (builder) => {
    builder
      .addCase(added, playersAdapter.addOne)
      .addCase(removed, playersAdapter.removeOne);
  },
});

export const selectors = playersAdapter.getSelectors<RootState>(
  (state) => state.players
);

export default playersSlice;
