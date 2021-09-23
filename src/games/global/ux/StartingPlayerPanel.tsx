import { Avatar, Badge, Stack } from "@mui/material";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { invariant_violation, ReactUtils } from "common";
import { PlayerId } from "model/Player";
import { Strategy } from "features/template/Strategy";
import { playersSelectors } from "../../../features/players/playersSlice";
import {
  templateActions,
  templateSelectors,
} from "../../../features/template/templateSlice";
import { PlayerNameShortAbbreviation } from "./PlayerNameShortAbbreviation";

function Player({
  playerId,
  isSelected,
}: {
  playerId: PlayerId;
  isSelected: boolean;
}): JSX.Element | null {
  const dispatch = useAppDispatch();

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
                  templateActions.constantValueChanged({
                    id: "firstPlayer",
                    value: playerId,
                  })
                )
            : undefined
        }
      >
        <PlayerNameShortAbbreviation playerId={playerId} />
      </Avatar>
    </Badge>
  );
}

export default function StartingPlayerPanel() {
  const playerIds = useAppSelector(playersSelectors.selectIds) as PlayerId[];

  const step = ReactUtils.useAppEntityIdSelectorEnforce(
    templateSelectors,
    "firstPlayer"
  );
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
