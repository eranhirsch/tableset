import { Checkbox, List, ListItem, ListItemText } from "@mui/material";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { Dict, Vec } from "common";
import { gameSelector } from "features/game/gameSlice";
import { ProductId } from "model/Game";
import React from "react";
import { expansionsActions, hasExpansionSelector } from "./expansionsSlice";

export function ExpansionListItem({
  productId,
}: {
  productId: ProductId;
}): JSX.Element {
  const dispatch = useAppDispatch();

  const game = useAppSelector(gameSelector);
  const isEnabled = useAppSelector(hasExpansionSelector(productId));

  const product = game.products[productId];

  return (
    <ListItem disablePadding>
      <ListItemText primary={product.name} />
      <Checkbox
        edge="end"
        checked={isEnabled}
        onChange={() => dispatch(expansionsActions.toggled(productId))}
      />
    </ListItem>
  );
}

export function Expansions(): JSX.Element {
  const { products } = useAppSelector(gameSelector);

  return (
    <List sx={{ width: "100%" }}>
      {React.Children.toArray(
        Vec.map_with_key(
          Dict.sort_by(products, ({ isBase }) => (isBase ? 0 : 1)),
          (productId) => <ExpansionListItem productId={productId} />
        )
      )}
    </List>
  );
}
