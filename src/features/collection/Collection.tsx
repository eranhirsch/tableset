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
import { nullthrows, Shape, Vec } from "common";
import { gameSelector } from "features/game/gameSlice";
import { useGameHomeToolbarButton } from "features/game/useGameHomeToolbarButton";
import { GameId, GAMES } from "games/core/GAMES";
import { ProductId } from "model/Game";
import React from "react";
import { useSearchParams } from "react-router-dom";
import {
  collectionActions,
  collectionSelectors,
  hasProductSelector,
} from "./collectionSlice";

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

function WholeCollection(): JSX.Element {
  const everything = useAppSelector(collectionSelectors.selectAll);
  return (
    <>
      {Vec.map(everything, ({ id, products }, index) => (
        <React.Fragment key={id}>
          {index > 0 && <Divider />}
          <List
            subheader={
              <ListSubheader disableGutters>{GAMES[id].name}</ListSubheader>
            }
          >
            {Vec.map(products, (pid) => (
              <ListItem key={pid}>
                <ListItemText>{GAMES[id].products[pid].name}</ListItemText>
              </ListItem>
            ))}
          </List>
        </React.Fragment>
      ))}
    </>
  );
}

export function Collection(): JSX.Element {
  const [searchParams] = useSearchParams();
  const homeButton = useGameHomeToolbarButton();

  const gameId = searchParams.get("gameId");

  if (gameId == null) {
    return (
      <TSPage header="Collection">
        <WholeCollection />
      </TSPage>
    );
  }

  const { products, name } = nullthrows(
    GAMES[gameId as GameId],
    `Unknown game ID: ${gameId} when loading collection`
  );

  const [implemented, unimplemented] = Shape.partition(
    products,
    ({ isNotImplemented }) => !isNotImplemented
  );
  const [expansions, bases] = Shape.partition(
    implemented,
    (product) => !product?.isBase
  );

  return (
    <TSPage title={`${name}: Collection`} buttons={[homeButton]}>
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
