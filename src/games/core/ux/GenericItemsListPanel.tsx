import { Chip } from "@mui/material";
import { Action } from "@reduxjs/toolkit";
import { useAppDispatch } from "../../../app/hooks";

export function GenericItemsListPanel<T extends string = string>({
  itemIds,
  onLabelForItem,
  onUpdateItem,
  selectedId,
}: {
  itemIds: readonly T[];
  onLabelForItem: (itemId: T) => string;
  onUpdateItem: (itemId: T) => Action;
  selectedId: T;
}): JSX.Element | null {
  const dispatch = useAppDispatch();

  return (
    <>
      {itemIds.map((itemId) => (
        <Chip
          key={itemId}
          variant={selectedId === itemId ? "filled" : "outlined"}
          label={onLabelForItem(itemId)}
          onClick={
            selectedId !== itemId
              ? () => dispatch(onUpdateItem(itemId))
              : undefined
          }
        />
      ))}
    </>
  );
}
