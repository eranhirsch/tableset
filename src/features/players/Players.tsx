import { Divider, List, ListSubheader, Stack } from "@mui/material";
import { Vec } from "common";
import { useMemo } from "react";
import { useAppSelector } from "../../app/hooks";
import { ActivePlayerListItem } from "./ActivePlayerListItem";
import { NewPlayerInput } from "./NewPlayerInput";
import { playersSelectors } from "./playersSlice";

export function Players(): JSX.Element | null {
  const players = useAppSelector(playersSelectors.selectAll);

  const [active, inActive] = useMemo(
    () => Vec.partition(players, ({ isActive }) => isActive),
    [players]
  );

  return (
    <Stack direction="column" spacing={1}>
      <List subheader={<ListSubheader>Playing</ListSubheader>}>
        {Vec.map(active, (player) => (
          <ActivePlayerListItem key={player.id} player={player} />
        ))}
      </List>
      {!Vec.is_empty(active) && !Vec.is_empty(inActive) && <Divider />}
      {!Vec.is_empty(inActive) && (
        <List subheader={<ListSubheader>Available</ListSubheader>}>
          {Vec.map(inActive, (player) => (
            <ActivePlayerListItem key={player.id} player={player} />
          ))}
        </List>
      )}
      <NewPlayerInput />
    </Stack>
  );
}
