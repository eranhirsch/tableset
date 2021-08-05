import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import playersSlice from "../features/players/playersSlice";
import templateSlice from "../features/template/templateSlice";

export const store = configureStore({
  reducer: {
    [templateSlice.name]: templateSlice.reducer,
    [playersSlice.name]: playersSlice.reducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
