import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import templateReducer from "../features/template/templateSlice";
import playersReducer from "../features/players/playersSlice";

export const store = configureStore({
  reducer: {
    template: templateReducer,
    players: playersReducer,
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
