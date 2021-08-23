import {
  createEntityAdapter,
  createSlice,
  EntityId,
  PayloadAction,
} from "@reduxjs/toolkit";
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
    added: playersAdapter.addOne,
    removed: {
      prepare: (id: EntityId, playersTotal: number) => ({
        payload: id,
        // Needed for the templateSlice
        meta: playersTotal,
      }),
      reducer: (state, { payload: id }: PayloadAction<EntityId, any, number>) =>
        playersAdapter.removeOne(state, id),
    },
  },
});

export const selectors = playersAdapter.getSelectors<RootState>(
  (state) => state.players
);

export default playersSlice;
