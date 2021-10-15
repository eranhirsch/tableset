import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import { expansionsSlice } from "features/expansions/expansionsSlice";
import { gameSlice } from "features/game/gameSlice";
import { instanceSlice } from "features/instance/instanceSlice";
import { playersSlice } from "features/players/playersSlice";
import { templateSlice } from "features/template/templateSlice";
import { loadStateFromLocalStorage, storeStateInLocalStorage } from "./persist";

export const store = configureStore({
  reducer: {
    [templateSlice.name]: templateSlice.reducer,
    [playersSlice.name]: playersSlice.reducer,
    [instanceSlice.name]: instanceSlice.reducer,
    [gameSlice.name]: gameSlice.reducer,
    [expansionsSlice.name]: expansionsSlice.reducer,
  },
  preloadedState: loadStateFromLocalStorage(),
});

store.subscribe(() => storeStateInLocalStorage(store));

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
