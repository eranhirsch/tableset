import AddBoxIcon from "@mui/icons-material/AddBox";
import { List, ListItem, ListItemButton, ListSubheader } from "@mui/material";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { TSPage } from "app/ux/Chrome";
import { Megaphone } from "app/ux/Megaphone";
import { $, base64Url, invariant_violation, ReactUtils, Vec } from "common";
import { allProductIdsSelector } from "features/collection/collectionSlice";
import { hasActivePlayersSelector } from "features/players/playersSlice";
import {
  hasGameTemplateSelector,
  templateActions,
} from "features/template/templateSlice";
import { GameId, GAMES, isGameId } from "games/core/GAMES";
import { Link, useNavigate, useParams } from "react-router-dom";

export function GameHomeWrapper(): JSX.Element {
  const { gameId } = useParams();
  if (gameId == null) {
    invariant_violation(`Missing routing param 'gameId'`);
  }

  if (!isGameId(gameId)) {
    invariant_violation(`Unknown gameId ${gameId}`);
  }

  return <GameHome gameId={gameId} />;
}

function GameHome({ gameId }: { gameId: GameId }): JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const navigateToChild = ReactUtils.useNavigateToChild();

  const game = GAMES[gameId]!;

  const products = useAppSelector(allProductIdsSelector(game));
  const hasActivePlayers = useAppSelector(hasActivePlayersSelector);
  const hasTemplate = useAppSelector(hasGameTemplateSelector(game));

  return (
    <TSPage
      title={game.name}
      buttons={[[<AddBoxIcon />, `/collection?gameId=${gameId}`]]}
    >
      {Vec.is_empty(products) ? (
        <NoProductsMegaphone gameId={gameId} />
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
              navigate("/template");
            }}
          >
            New
          </ListItemButton>
        </ListItem>
      </List>
      <List subheader={<ListSubheader>Tables</ListSubheader>}>
        <ListItem disableGutters>
          <ListItemButton
            onClick={() =>
              $(
                // Compute the buffer for an empty instance
                game.instanceAvroType.toBuffer({}),
                ($$) => base64Url.encode($$),
                ($$) => navigateToChild($$)
              )
            }
          >
            Manual
          </ListItemButton>
        </ListItem>
      </List>
    </TSPage>
  );
}

function NoProductsMegaphone({ gameId }: { gameId: GameId }): JSX.Element {
  const { name } = GAMES[gameId]!;
  return (
    <Megaphone
      header={`There are no ${name} products in your collection.`}
      body={
        <>
          For a better experience add some <em>before</em> generating tables for
          the game.
        </>
      }
      cta={{ label: "Go to Collection", url: `/collection?gameId=${gameId}` }}
    />
  );
}

