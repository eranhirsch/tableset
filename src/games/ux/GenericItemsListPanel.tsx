import { Chip } from "@material-ui/core";
import { Action } from "@reduxjs/toolkit";
import { useAppDispatch } from "../../app/hooks";

export type IItemsGameStep = Readonly<{
  items: readonly string[];
  labelForItem(itemId: string): string;
  updateFixedItemActionForId(itemId: string): Action;
}>;

export default function GenericItemsListPanel({
  itemsStep,
  selectedItemId,
}: {
  itemsStep: IItemsGameStep;
  selectedItemId: string;
}) {
  const dispatch = useAppDispatch();

  return (
    <>
      {itemsStep.items.map((itemId) => (
        <Chip
          key={itemId}
          variant={selectedItemId === itemId ? "filled" : "outlined"}
          label={itemsStep.labelForItem(itemId)}
          onClick={
            selectedItemId !== itemId
              ? () => dispatch(itemsStep.updateFixedItemActionForId(itemId))
              : undefined
          }
        />
      ))}
    </>
  );
}
