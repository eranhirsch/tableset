import { ColorId } from "app/utils/Colors";
import { ProductId } from "model/Game";

export type ColorFunction<ItemId> = (itemId: ItemId) => ColorId | undefined;

export type ProductsFunction<
  ItemId extends string | number,
  Pid extends ProductId
> = (productIds: readonly Pid[]) => readonly ItemId[];

export type LabelFunction<ItemId> = (itemId: ItemId) => string;
