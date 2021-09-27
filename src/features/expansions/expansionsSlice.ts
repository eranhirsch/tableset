import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "app/store";
import { ProductId } from "model/IGame";

interface State {
  expansions: readonly string[];
}

const initialState: State = { expansions: [] };

const expansionsSlice = createSlice({
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
export default expansionsSlice;

export const expansionsActions = expansionsSlice.actions;

export const hasExpansionSelector =
  (productId: ProductId) => (state: RootState) =>
    state.expansions.expansions.includes(productId);
