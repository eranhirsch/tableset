import { List, ListItem, ListItemButton } from "@mui/material";
import { useAppDispatch } from "app/hooks";
import { Vec } from "common";
import { GAMES } from "games/core/GAMES";
import { useHistory } from "react-router";
import { gameActions } from "./gameSlice";

export function Games(): JSX.Element {
  const history = useHistory();
  const dispatch = useAppDispatch();
  return (
    <List>
      {Vec.map_with_key(GAMES, (gameId, game) => (
        <ListItem key={gameId} disablePadding>
          <ListItemButton
            onClick={() => {
              dispatch(gameActions.set(game));
              history.push("/");
            }}
          >
            {game.name}
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}
