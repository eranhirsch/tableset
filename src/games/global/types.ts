import { ProductId } from "model/Game";
import { GamePiecesColor } from "model/GamePiecesColor";

export type ColorFunction<ItemId extends string | number> = (
  itemId: ItemId
) => GamePiecesColor;

export type ProductsFunction<
  ItemId extends string | number,
  Pid extends ProductId
> = (productIds: readonly Pid[]) => readonly ItemId[];

export type LabelFunction<ItemId extends string | number> = (
  itemId: ItemId
) => string;
