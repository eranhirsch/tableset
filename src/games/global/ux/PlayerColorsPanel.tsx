import { Avatar, Badge, Stack } from "@material-ui/core";
import { useAppSelector } from "../../../app/hooks";
import nullthrows from "../../../common/err/nullthrows";
import PlayerColors from "../../../common/PlayerColors";
import short_name from "../../../common/short_name";
import { playersSelectors } from "../../../features/players/playersSlice";

export function PlayerColorsPanel({
  playerColor,
}: {
  playerColor: PlayerColors;
}) {
  const players = useAppSelector(playersSelectors.selectEntities);

  return (
    <Stack direction="row" spacing={1}>
      {Object.entries(playerColor).map(([playerId, color]) => (
        <Badge
          key={playerId}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          overlap="circular"
          invisible={false}
          color={color}
        >
          <Avatar>{short_name(nullthrows(players[playerId]).name)}</Avatar>
        </Badge>
      ))}
    </Stack>
  );
}
