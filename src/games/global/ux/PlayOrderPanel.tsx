import { Avatar, AvatarGroup, Box } from "@material-ui/core";
import { useAppSelector } from "../../../app/hooks";
import nullthrows from "../../../common/err/nullthrows";
import short_name from "../../../common/short_name";
import {
  PlayerId,
  firstPlayerSelector,
  selectors as playersSelectors,
} from "../../../features/players/playersSlice";

export function PlayOrderPanel({
  playOrder,
}: {
  playOrder: readonly PlayerId[];
}) {
  const firstPlayer = useAppSelector(firstPlayerSelector);
  const players = useAppSelector(playersSelectors.selectEntities);

  return (
    <Box display="flex">
      <AvatarGroup>
        <Avatar>{short_name(firstPlayer.name)}</Avatar>
        {playOrder.map((playerId) => (
          <Avatar key={playerId}>
            {short_name(nullthrows(players[playerId]).name)}
          </Avatar>
        ))}
      </AvatarGroup>
    </Box>
  );
}
