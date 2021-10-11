import { Divider, List } from "@mui/material";
import { PlayerId } from "model/Player";
import React from "react";
import { useAppSelector } from "../../app/hooks";
import { NewPlayerInput } from "./NewPlayerInput";
import { PlayerListItem } from "./PlayerListItem";
import { playersSelectors } from "./playersSlice";

export function Players(): JSX.Element | null {
  const playerIds = useAppSelector(
    playersSelectors.selectIds
  ) as readonly PlayerId[];

  return (
    <>
      <NewPlayerInput />
      <List sx={{ width: "100%" }}>
        {React.Children.toArray(
          playerIds.map((playerId, index) => (
            <>
              {index > 0 && <Divider variant="middle" component="li" />}
              <PlayerListItem playerId={playerId} />
            </>
          ))
        )}
      </List>
    </>
  );
}
