import {
  Checkbox,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { TSPage } from "app/ux/Chrome";
import { Shape, Vec } from "common";
import { gameSelector } from "features/game/gameSlice";
import { useGameHomeToolbarButton } from "features/game/useGameHomeToolbarButton";
import { ProductId } from "model/Game";
import React from "react";
import { collectionActions, hasProductSelector } from "./collectionSlice";

export function ExpansionListItem({
  productId,
  disabled = false,
}: {
  productId: ProductId;
  disabled?: boolean;
}): JSX.Element {
  const dispatch = useAppDispatch();

  const game = useAppSelector(gameSelector);
  const isEnabled = useAppSelector(hasProductSelector(game, productId));

  const product = game.products[productId];

  return (
    <ListItem disablePadding disabled={disabled}>
      <ListItemText primary={product.name} />
      <Checkbox
        edge="end"
        checked={isEnabled}
        onChange={() => dispatch(collectionActions.toggled(game, productId))}
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

export function Collection(): JSX.Element {
  const homeButton = useGameHomeToolbarButton();

  const game = useAppSelector(gameSelector);

  const [implemented, unimplemented] = Shape.partition(
    game.products,
    ({ isNotImplemented }) => !isNotImplemented
  );
  const [expansions, bases] = Shape.partition(
    implemented,
    (product) => !product?.isBase
  );

  return (
    <TSPage title={`${game.name}: Collection`} buttons={[homeButton]}>
      <Expansions productIds={Vec.keys(bases)} subheader="Base" />
      <Divider />
      <Expansions productIds={Vec.keys(expansions)} subheader="Expansions" />
      <Divider />
      <Expansions
        productIds={Vec.keys(unimplemented)}
        disabled
        subheader="Not Implemented"
      />
    </TSPage>
  );
}
