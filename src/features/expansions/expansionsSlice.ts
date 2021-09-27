import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GameId } from "games/core/GameMapper";

interface State {
  gameId: GameId;
  expansions: readonly string[];
}

const initialState: State = { gameId: "concordia", expansions: [] };

export default createSlice({
  name: "expansions",
  initialState,
  reducers: {
    added: (
      { expansions },
      { payload: expansionId }: PayloadAction<string>
    ) => {
      expansions.push(expansionId);
    },
    removed: (state, { payload: expansionId }: PayloadAction<string>) => ({
      ...state,
      expansions: state.expansions.filter((id) => expansionId !== id),
    }),
  },
});
