import {
  createEntityAdapter,
  createSelector,
  createSlice,
  nanoid,
  PayloadAction
} from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { Dict, nullthrows, Vec } from "../../common";
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

export const allPlayersSelectors = playersAdapter.getSelectors<RootState>(
  (state) => state.players
);

export const playersSelectors: typeof allPlayersSelectors = Object.freeze({
  selectIds: createSelector(allPlayersSelectors.selectAll, (players) => [
    ...Vec.map(
      Vec.filter(players, ({ isActive }) => isActive),
      ({ id }) => id
    ),
  ]),
  selectEntities: createSelector(
    allPlayersSelectors.selectEntities,
    (entities) =>
      Dict.filter(Dict.filter_nulls(entities), ({ isActive }) => isActive)
  ),
  selectAll: createSelector(allPlayersSelectors.selectAll, (players) => [
    ...Vec.filter(players, ({ isActive }) => isActive),
  ]),
  selectTotal: createSelector(allPlayersSelectors.selectAll, (players) =>
    Vec.count_where(players, ({ isActive }) => isActive)
  ),
  selectById: createSelector(allPlayersSelectors.selectById, (player) =>
    player?.isActive ? player : undefined
  ),
});

export const firstPlayerIdSelector = createSelector(
  allPlayersSelectors.selectIds,
  (playerIds) => nullthrows(playerIds[0]) as PlayerId
);

export const allPlayerNamesSelector = createSelector(
  allPlayersSelectors.selectAll,
  (players) => players.map((player) => player.name)
);

export const hasActivePlayersSelector = createSelector(
  allPlayersSelectors.selectAll,
  (players) => Vec.count_where(players, ({ isActive }) => isActive) > 0
);

export const playersActions = playersSlice.actions;