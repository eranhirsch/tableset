import { Divider, List, ListSubheader, Stack } from "@mui/material";
import { TSPage } from "app/ux/Chrome";
import { Megaphone } from "app/ux/Megaphone";
import { Vec } from "common";
import { useMemo } from "react";
import { useAppSelector } from "../../app/hooks";
import { NewPlayerInput } from "./NewPlayerInput";
import { PlayerListItem } from "./PlayerListItem";
import { allPlayersSelectors } from "./playersSlice";

export function Players(): JSX.Element | null {
  const players = useAppSelector(allPlayersSelectors.selectAll);

  const [active, inActive] = useMemo(
    () => Vec.partition(players, ({ isActive }) => isActive),
    [players]
  );

  return (
    <TSPage>
      <Stack direction="column" spacing={1}>
        {Vec.is_empty(players) ? (
          <Megaphone
            header="No players!"
            body="Presence works best when you tell us who's around the table."
          />
        ) : (
          <>
            <List subheader={<ListSubheader>Playing</ListSubheader>}>
              {Vec.map(active, (player) => (
                <PlayerListItem key={player.id} player={player} />
              ))}
              {Vec.is_empty(active) && (
                <Megaphone
                  header="No one at the table?"
                  body={
                    "Adding players allows us to offer suitable modules for " +
                    "the player count, compute steps automatically, and " +
                    "personalize instructions for those at the table."
                  }
                />
              )}
            </List>
            {!Vec.is_empty(active) && !Vec.is_empty(inActive) && <Divider />}
            {!Vec.is_empty(inActive) && (
              <List subheader={<ListSubheader>Available</ListSubheader>}>
                {Vec.map(inActive, (player) => (
                  <PlayerListItem key={player.id} player={player} />
                ))}
              </List>
            )}
          </>
        )}
        <NewPlayerInput />
      </Stack>
    </TSPage>
  );
}
