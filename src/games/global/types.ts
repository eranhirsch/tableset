import { ProductId } from "model/Game";
import { GamePiecesColor } from "model/GamePiecesColor";

export type ColorFunction<ItemId> = (
  itemId: ItemId
) => GamePiecesColor | undefined;

export type ProductsFunction<
  ItemId extends string | number,
  Pid extends ProductId
> = (productIds: readonly Pid[]) => readonly ItemId[];

export type LabelFunction<ItemId> = (itemId: ItemId) => string;
