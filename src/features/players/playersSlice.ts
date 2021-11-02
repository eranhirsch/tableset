import {
  createEntityAdapter,
  createSelector,
  createSlice,
  nanoid,
  PayloadAction
} from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { nullthrows, Vec } from "../../common";
import { Player, PlayerId } from "../../model/Player";

const playersAdapter = createEntityAdapter<Player>({
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

export const playersSlice = createSlice({
  name: "players",
  initialState: playersAdapter.getInitialState(),
  reducers: {
    created: {
      prepare: (name: string) => ({
        payload: { id: nanoid(), name: name, isActive: false },
      }),
      reducer: playersAdapter.addOne,
    },

    deleted: {
      prepare: ({ id }: Player) => ({ payload: id }),
      reducer: playersAdapter.removeOne,
    },

    addedToTable: {
      prepare: ({ id }: Player) => ({ payload: id }),
      reducer(state, { payload: playerId }: PayloadAction<PlayerId>) {
        state.entities[playerId]!.isActive = true;
      },
    },

    removedFromTable: {
      prepare: ({ id }: Player) => ({ payload: id }),
      reducer(state, { payload: playerId }: PayloadAction<PlayerId>) {
        state.entities[playerId]!.isActive = false;
      },
    },
  },
});

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

export const hasActivePlayers = createSelector(
  playersSelectors.selectAll,
  (players) => Vec.count_where(players, ({ isActive }) => isActive) > 0
);

export const playersActions = playersSlice.actions;