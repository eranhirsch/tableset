import {
  Checkbox,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { Shape, Vec } from "common";
import { gameSelector } from "features/game/gameSlice";
import { ProductId } from "model/Game";
import React from "react";
import { expansionsActions, hasExpansionSelector } from "./expansionsSlice";

export function ExpansionListItem({
  productId,
  disabled = false,
}: {
  productId: ProductId;
  disabled?: boolean;
}): JSX.Element {
  const dispatch = useAppDispatch();

  const game = useAppSelector(gameSelector);
  const isEnabled = useAppSelector(hasExpansionSelector(productId));

  const product = game.products[productId];

  return (
    <ListItem disablePadding disabled={disabled}>
      <ListItemText primary={product.name} />
      <Checkbox
        edge="end"
        checked={isEnabled}
        onChange={() => dispatch(expansionsActions.toggled(productId))}
      />
    </ListItem>
  );
}

function Expansions({
  productIds,
  disabled = false,
  subheader,
}: {
  productIds: readonly ProductId[];
  disabled?: boolean;
  subheader: string;
}): JSX.Element {
  return (
    <List
      sx={{ width: "100%" }}
      subheader={<ListSubheader disableGutters>{subheader}</ListSubheader>}
    >
      {React.Children.toArray(
        Vec.map(productIds, (productId) => (
          <ExpansionListItem productId={productId} disabled={disabled} />
        ))
      )}
    </List>
  );
}

export function Products(): JSX.Element {
  const { products } = useAppSelector(gameSelector);
  const [implemented, unimplemented] = Shape.partition(
    products,
    ({ isNotImplemented }) => !isNotImplemented
  );
  const [expansions, bases] = Shape.partition(
    implemented,
    (product) => !product?.isBase
  );
  return (
    <>
      <Expansions productIds={Vec.keys(bases)} subheader="Base" />
      <Divider />
      <Expansions productIds={Vec.keys(expansions)} subheader="Expansions" />
      <Divider />
      <Expansions
        productIds={Vec.keys(unimplemented)}
        disabled
        subheader="Not Implemented"
      />
    </>
  );
}
