import { List, ListItem, ListItemButton, ListSubheader } from "@mui/material";
import { useAppDispatch, useAppSelector } from "app/hooks";
import {
  hasGameTemplate,
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

  const hasTemplate = useAppSelector(hasGameTemplate(game));

  return (
    <>
      <List subheader={<ListSubheader>Recipes</ListSubheader>}>
        <ListItem disableGutters>
          {hasTemplate && (
            <ListItemButton component={Link} to="/template">
              Current
            </ListItemButton>
          )}
        </ListItem>
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
        <ListItem disableGutters>
          <ListItemButton></ListItemButton>
        </ListItem>
      </List>
    </>
  );
}
