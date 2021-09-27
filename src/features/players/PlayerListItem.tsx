import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import {
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { ReactUtils } from "common";
import { PlayerId } from "model/Player";
import { PlayerAvatar } from "./PlayerAvatar";
import {
  allPlayerNamesSelector,
  playersActions,
  playersSelectors,
} from "./playersSlice";
import { shortest_unique_name } from "./shortest_names";

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

  const allNames = useAppSelector(allPlayerNamesSelector);

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
        primary={shortest_unique_name(player.name, allNames)}
        secondary={player.name}
      />
    </ListItem>
  );
}
