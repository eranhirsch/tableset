import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

interface Player {
  name: string;
}

const playersAdapter = createEntityAdapter<Player>({
  selectId: (player) => player.name,
});

const playersSlice = createSlice({
  name: "players",
  initialState: playersAdapter.getInitialState(),
  reducers: {
    playerAdded: playersAdapter.addOne,
    playerRemoved: playersAdapter.removeOne,
  },
});

export const { playerAdded, playerRemoved } = playersSlice.actions;

export const {
  selectIds: selectPlayerIds,
  selectById: selectPlayerById,
  selectAll: selectAllPlayers,
} = playersAdapter.getSelectors<RootState>((state) => state.players);

export default playersSlice.reducer;
