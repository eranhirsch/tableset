import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "app/store";
import { ProductId } from "model/Game";

interface State {
  expansions: readonly string[];
}

const initialState: State = { expansions: [] };

export const expansionsSlice = createSlice({
  name: "expansions",
  initialState,
  reducers: {
    toggled(state, { payload: productId }: PayloadAction<ProductId>) {
      if (state.expansions.includes(productId)) {
        return {
          ...state,
          expansions: state.expansions.filter((id) => productId !== id),
        };
      }

      state.expansions.push(productId);
    },
  },
});

export const expansionsActions = expansionsSlice.actions;

export const allExpansionIdsSelector = (state: RootState) =>
  state.expansions.expansions;
export const expansionsTotalSelector = createSelector(
  allExpansionIdsSelector,
  (expansions) => expansions.length
);
export const hasExpansionSelector =
  (productId: ProductId) => (state: RootState) =>
    allExpansionIdsSelector(state).includes(productId);
