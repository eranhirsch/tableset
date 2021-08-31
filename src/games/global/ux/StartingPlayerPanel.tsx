import { Avatar, Badge, Stack } from "@material-ui/core";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import invariant_violation from "../../../common/err/invariant_violation";
import { useAppEntityIdSelectorEnforce } from "../../../common/hooks/useAppEntityIdSelector";
import short_name from "../../../common/short_name";
import { Strategy } from "../../../core/Strategy";
import {
  PlayerId,
  selectors as playersSelectors,
} from "../../../features/players/playersSlice";
import templateSlice, {
  templateSelectors,
} from "../../../features/template/templateSlice";

function Player({
  playerId,
  isSelected,
}: {
  playerId: PlayerId;
  isSelected: boolean;
}) {
  const dispatch = useAppDispatch();

  const player = useAppEntityIdSelectorEnforce(playersSelectors, playerId);

  return (
    <Badge
      color="primary"
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      overlap="circular"
      badgeContent={isSelected ? "1" : undefined}
    >
      <Avatar
        sx={{ margin: 0.5 }}
        onClick={
          !isSelected
            ? () =>
                dispatch(
                  templateSlice.actions.constantValueChanged({
                    id: "firstPlayer",
                    value: playerId,
                  })
                )
            : undefined
        }
      >
        {short_name(player.name)}
      </Avatar>
    </Badge>
  );
}

export default function StartingPlayerPanel() {
  const playerIds = useAppSelector(playersSelectors.selectIds) as PlayerId[];

  const step = useAppEntityIdSelectorEnforce(templateSelectors, "firstPlayer");
  if (step.id !== "firstPlayer" || step.strategy !== Strategy.FIXED) {
    invariant_violation(`Step ${step} is misconfigured for this panel`);
  }
  const selectedPlayerId = step.value;

  return (
    <Stack component="ul" direction="row" pl={0} sx={{ listStyle: "none" }}>
      {playerIds.map((playerId) => (
        <Player
          key={playerId}
          playerId={playerId}
          isSelected={playerId === selectedPlayerId}
        />
      ))}
    </Stack>
  );
}
