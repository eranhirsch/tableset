import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import {
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import { useAppDispatch } from "app/hooks";
import { ReactUtils } from "common";
import { PlayerId } from "model/Player";
import { PlayerAvatar } from "./PlayerAvatar";
import { PlayerShortName } from "./PlayerShortName";
import { playersActions, playersSelectors } from "./playersSlice";

export function PlayerListItem({
  playerId,
}: {
  playerId: PlayerId;
}): JSX.Element | null {
  const dispatch = useAppDispatch();

  const player = ReactUtils.useAppEntityIdSelectorEnforce(
    playersSelectors,
    playerId
  );

  return (
    <ListItem
      disablePadding
      secondaryAction={
        <IconButton onClick={() => dispatch(playersActions.removed(player.id))}>
          <PersonRemoveIcon />
        </IconButton>
      }
    >
      <ListItemAvatar>
        <PlayerAvatar playerId={playerId} />
      </ListItemAvatar>
      <ListItemText
        primary={<PlayerShortName playerId={playerId} />}
        secondary={player.name}
      />
    </ListItem>
  );
}
