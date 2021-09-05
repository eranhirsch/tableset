import { Avatar, AvatarGroup, Box } from "@material-ui/core";
import { useAppSelector } from "../../../app/hooks";
import nullthrows from "../../../common/err/nullthrows";
import short_name from "../../../common/short_name";
import {
  PlayerId,
  firstPlayerSelector,
  playersSelectors,
} from "../../../features/players/playersSlice";
import { VariableStepInstanceComponentProps } from "../../core/steps/createVariableGameStep";

export default function PlayOrderPanel({
  value: playOrder,
}: VariableStepInstanceComponentProps<readonly PlayerId[]>): JSX.Element {
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
