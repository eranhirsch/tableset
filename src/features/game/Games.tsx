import { List, ListItem, ListItemButton } from "@mui/material";
import { useAppDispatch } from "app/hooks";
import { TSPage } from "app/ux/Chrome";
import { Vec } from "common";
import { GAMES } from "games/core/GAMES";
import { useNavigate } from "react-router-dom";
import { gameActions } from "./gameSlice";

export function Games(): JSX.Element {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  return (
    <TSPage>
      <List>
        {Vec.map_with_key(GAMES, (gameId, game) => (
          <ListItem key={gameId} disablePadding>
            <ListItemButton
              onClick={() => {
                dispatch(gameActions.set(game));
                navigate(gameId);
              }}
            >
              {game.name}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </TSPage>
  );
}
