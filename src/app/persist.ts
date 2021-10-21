import { CombinedState, PreloadedState, Store } from "@reduxjs/toolkit";
import { NoInfer } from "@reduxjs/toolkit/dist/tsHelpers";

const LOCAL_STORAGE_KEY = "__redux_state";

export const storeStateInLocalStorage = (store: Store) =>
  setTimeout(() =>
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(store.getState()))
  );

export function loadStateFromLocalStorage<S>():
  | PreloadedState<CombinedState<NoInfer<S>>>
  | undefined {
  const serialized = localStorage.getItem(LOCAL_STORAGE_KEY);
  return serialized == null ? undefined : JSON.parse(serialized);
}

export const resetStateInLocalStorage = () =>
  localStorage.removeItem(LOCAL_STORAGE_KEY);
