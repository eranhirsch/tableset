import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import { collectionSlice } from "features/collection/collectionSlice";
import { gameSlice } from "features/game/gameSlice";
import { playersSlice } from "features/players/playersSlice";
import { templateSlice } from "features/template/templateSlice";
import { loadStateFromLocalStorage, storeStateInLocalStorage } from "./persist";

export const store = configureStore({
  reducer: {
    [templateSlice.name]: templateSlice.reducer,
    [playersSlice.name]: playersSlice.reducer,
    [gameSlice.name]: gameSlice.reducer,
    [collectionSlice.name]: collectionSlice.reducer,
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
