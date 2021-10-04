import { List, ListItem, ListItemText, Switch } from "@mui/material";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { Vec } from "common";
import { gameSelector } from "features/game/gameSlice";
import { ProductId } from "model/IGame";
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
      <Switch
        edge="end"
        checked={isEnabled}
        disabled={product.isBase}
        onChange={() => dispatch(expansionsActions.toggled(productId))}
      />
    </ListItem>
  );
}

export function Expansions(): JSX.Element {
  const game = useAppSelector(gameSelector);

  return (
    <List sx={{ width: "100%" }}>
      {React.Children.toArray(
        Vec.map_with_key(game.products, (productId) => (
          <ExpansionListItem productId={productId} />
        ))
      )}
    </List>
  );
}
