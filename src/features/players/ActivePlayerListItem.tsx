import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import {
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
} from "@mui/material";
import { useAppDispatch } from "app/hooks";
import { Player } from "model/Player";
import { PlayerAvatar } from "./PlayerAvatar";
import { PlayerShortName } from "./PlayerShortName";
import { playersActions } from "./playersSlice";

export function ActivePlayerListItem({
  player,
}: {
  player: Player;
}): JSX.Element | null {
  const dispatch = useAppDispatch();

  const avatar = (
    <ListItemAvatar>
      <PlayerAvatar playerId={player.id} />
    </ListItemAvatar>
  );

  return (
    <ListItem disablePadding>
      <ListItemButton
        onClick={() =>
          dispatch(
            player.isActive
              ? playersActions.removedFromTable(player)
              : playersActions.addedToTable(player)
          )
        }
      >
        {avatar}
        <ListItemText
          primary={<PlayerShortName playerId={player.id} />}
          secondary={player.name}
        />
        {!player.isActive && (
          <ListItemSecondaryAction>
            <IconButton
              onClick={() => dispatch(playersActions.deleted(player))}
            >
              <DeleteForeverIcon />
            </IconButton>
          </ListItemSecondaryAction>
        )}
      </ListItemButton>
    </ListItem>
  );
}
