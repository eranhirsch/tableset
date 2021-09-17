import {
  createEntityAdapter,
  createSelector,
  createSlice,
  nanoid,
} from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import nullthrows from "../../common/err/nullthrows";

export type PlayerId = string;

export interface Player {
  id: PlayerId;
  name: string;
}

const playersAdapter = createEntityAdapter<Player>({
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

const playersSlice = createSlice({
  name: "players",
  initialState: playersAdapter.getInitialState(),
  reducers: {
    added: {
      prepare: (name: string) => ({
        payload: { id: nanoid(), name: name },
      }),
      reducer: playersAdapter.addOne,
    },
    removed: playersAdapter.removeOne,
  },
});

export const playersSelectors = playersAdapter.getSelectors<RootState>(
  (state) => state.players
);

export const firstPlayerSelector = createSelector(
  playersSelectors.selectAll,
  (players) => nullthrows(players[0])
);

export const allPlayerNamesSelector = createSelector(
  playersSelectors.selectAll,
  (players) => players.map((player) => player.name)
);

export default playersSlice;
