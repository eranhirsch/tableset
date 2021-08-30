import {
  createEntityAdapter,
  createSlice,
  EntityId,
  nanoid,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import nullthrows from "../../common/err/nullthrows";
import { GameId } from "../../games/GameMapper";

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
      prepare: (name: string, gameId: GameId) => ({
        payload: { id: nanoid(), name: name },
        meta: gameId,
      }),
      reducer: playersAdapter.addOne,
    },
    removed: {
      prepare: (id: PlayerId, playersTotal: number) => ({
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

export const firstPlayerSelector = (state: RootState) =>
  nullthrows(state.players.entities[state.players.ids[0]]);

export default playersSlice;
