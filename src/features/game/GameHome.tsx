import { List, ListItem, ListItemButton, ListSubheader } from "@mui/material";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { Megaphone } from "app/ux/Megaphone";
import { Vec } from "common";
import { allProductIdsSelector } from "features/collection/collectionSlice";
import {
  hasGameInstanceSelector,
  instanceActions,
} from "features/instance/instanceSlice";
import { hasActivePlayersSelector } from "features/players/playersSlice";
import {
  hasGameTemplateSelector,
  templateActions,
} from "features/template/templateSlice";
import { GameId, GAMES } from "games/core/GAMES";
import { Game } from "model/Game";
import { Link, useHistory, useParams } from "react-router-dom";

export function GameHomeWrapper(): JSX.Element {
  const { gameId } = useParams<{ gameId: GameId }>();
  return <GameHome game={GAMES[gameId]} />;
}

function GameHome({ game }: { game: Readonly<Game> }): JSX.Element {
  const dispatch = useAppDispatch();
  const history = useHistory();

  const products = useAppSelector(allProductIdsSelector(game));
  const hasActivePlayers = useAppSelector(hasActivePlayersSelector);
  const hasTemplate = useAppSelector(hasGameTemplateSelector(game));
  const hasInstance = useAppSelector(hasGameInstanceSelector(game));

  return (
    <>
      {Vec.is_empty(products) ? (
        <NoProductsMegaphone game={game} />
      ) : (
        !hasActivePlayers && (
          <Megaphone
            header="Table is empty."
            body="Most games would not generate the correct results without knowing who's playing."
            cta={{ label: "Add Players", url: "/players" }}
          />
        )
      )}
      <List subheader={<ListSubheader>Recipes</ListSubheader>}>
        {hasTemplate && (
          <ListItem disableGutters>
            <ListItemButton component={Link} to="/template">
              Current
            </ListItemButton>
          </ListItem>
        )}
        <ListItem disableGutters>
          <ListItemButton
            onClick={() => {
              dispatch(templateActions.initialize(game));
              history.push(`/template`);
            }}
          >
            New
          </ListItemButton>
        </ListItem>
      </List>
      <List subheader={<ListSubheader>Tables</ListSubheader>}>
        {hasInstance && (
          <ListItem disableGutters>
            <ListItemButton component={Link} to="/instance">
              Last
            </ListItemButton>
          </ListItem>
        )}
        <ListItem disableGutters>
          <ListItemButton
            onClick={() => {
              dispatch(instanceActions.reset(game));
              history.push(`/instance`);
            }}
          >
            Manual
          </ListItemButton>
        </ListItem>
      </List>
    </>
  );
}

function NoProductsMegaphone({ game }: { game: Readonly<Game> }): JSX.Element {
  return (
    <Megaphone
      header={`There are no ${game.name} products in your collection.`}
      body={
        <>
          For a better experience add some <em>before</em> generating tables for
          the game.
        </>
      }
      cta={{ label: "Go to Collection", url: "/collection" }}
    />
  );
}
