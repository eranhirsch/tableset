import { Avatar, Badge, Stack } from "@material-ui/core";
import { EntityId } from "@reduxjs/toolkit";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useAppEntityIdSelectorEnforce } from "../../../common/hooks/useAppEntityIdSelector";
import templateSlice from "../templateSlice";
import { selectors as playersSelectors } from "../../players/playersSlice";
import short_name from "../../../common/short_name";

function Player({
  playerId,
  isSelected,
}: {
  playerId: EntityId;
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
                  templateSlice.actions.fixedValueSet({
                    stepId: "firstPlayer",
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

export default function StartingPlayerPanel({
  selectedPlayerId,
}: {
  selectedPlayerId: EntityId | undefined;
}) {
  const dispatch = useAppDispatch();

  const playerIds = useAppSelector(playersSelectors.selectIds);

  useEffect(() => {
    if (selectedPlayerId == null) {
      dispatch(
        templateSlice.actions.fixedValueSet({
          stepId: "firstPlayer",
          value: playerIds[0],
        })
      );
    }
  }, [dispatch, selectedPlayerId, playerIds]);

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
