import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootState } from "app/store";
import { Vec } from "common";
import { Game, ProductId } from "features/instance/Game";
import { GameId } from "games/core/GAMES";

interface Entity {
  id: GameId;
  products: readonly ProductId[];
}

const collectionAdapter = createEntityAdapter<Entity>();

export const collectionSlice = createSlice({
  name: "collection",
  initialState: collectionAdapter.getInitialState(),
  reducers: {
    toggled: {
      prepare: ({ id }: Game, productId: ProductId) => ({
        payload: { gameId: id, productId },
      }),
      reducer(
        state,
        {
          payload: { gameId, productId },
        }: PayloadAction<{ gameId: GameId; productId: ProductId }>
      ) {
        const entity = state.entities[gameId];
        const updated =
          entity != null && entity.products.includes(productId)
            ? Vec.filter(entity.products, (pid) => pid !== productId)
            : Vec.concat(entity?.products ?? [], productId);
        collectionAdapter.upsertOne(state, {
          id: gameId,
          products: updated,
        });
      },
    },
  },
});

export const collectionActions = collectionSlice.actions;

export const collectionSelectors = collectionAdapter.getSelectors<RootState>(
  (state) => state.collection
);

export const allProductIdsSelector =
  ({ id }: Game) =>
  (state: RootState) =>
    collectionSelectors.selectById(state, id)?.products ?? [];

export const hasProductSelector =
  (game: Game, productId: ProductId) => (state: RootState) =>
    allProductIdsSelector(game)(state).includes(productId);
