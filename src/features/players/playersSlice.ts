import {
  createEntityAdapter,
  createSelector,
  createSlice,
  nanoid,
} from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { nullthrows } from "../../common";
import { Player, PlayerId } from "../../model/Player";

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
export default playersSlice;

export const playersSelectors = playersAdapter.getSelectors<RootState>(
  (state) => state.players
);

export const firstPlayerIdSelector = createSelector(
  playersSelectors.selectIds,
  (playerIds) => nullthrows(playerIds[0]) as PlayerId
);

export const allPlayerNamesSelector = createSelector(
  playersSelectors.selectAll,
  (players) => players.map((player) => player.name)
);

export const playersActions = playersSlice.actions;