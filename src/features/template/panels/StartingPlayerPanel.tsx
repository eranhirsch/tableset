import { Avatar, Badge, Stack } from "@material-ui/core";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useAppEntityIdSelectorEnforce } from "../../../common/hooks/useAppEntityIdSelector";
import templateSlice, {
  selectors as templateSelectors,
} from "../templateSlice";
import {
  PlayerId,
  selectors as playersSelectors,
} from "../../players/playersSlice";
import short_name from "../../../common/short_name";
import { Strategy } from "../../../core/Strategy";
import invariant_violation from "../../../common/err/invariant_violation";

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
                    global: true,
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
