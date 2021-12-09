import { Avatar, AvatarGroup, Grid, Typography } from "@mui/material";
import { nullthrows, Str, Vec } from "common";
import { PlayerAvatar } from "features/players/PlayerAvatar";
import { fullPlayOrder, playersMetaStep } from "games/global";
import { Teams } from "games/global/steps/createTeamSelectionStep";
import { PlayerId } from "model/Player";
import React from "react";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps
} from "../../core/steps/createDerivedGameStep";
import firstPlayerStep from "./firstPlayerStep";
import noStartingResourcesVariant from "./noStartingResourcesVariant";
import playOrderStep from "./playOrderStep";
import teamPlayVariant from "./teamPlayVariant";
import teamSelectionStep from "./teamSelectionStep";

const STARTING_MONEY_BASE = 5;
const NO_RESOURCES_VARIANT_EXTRA = 20;

export default createDerivedGameStep({
  id: "startingMoney",
  dependencies: [
    playersMetaStep,
    playOrderStep,
    firstPlayerStep,
    noStartingResourcesVariant,
    teamPlayVariant,
    teamSelectionStep,
  ],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [
    playerIds,
    playOrder,
    firstPlayerId,
    isNoStartingResourcesVariantEnabled,
    teamPlay,
    teams,
  ],
}: DerivedStepInstanceComponentProps<
  readonly PlayerId[],
  readonly PlayerId[],
  PlayerId,
  boolean,
  boolean,
  Readonly<Teams>
>): JSX.Element {
  return (
    <>
      <Typography variant="body1">
        Players receive sestertii from the bank in the following denominations
        {(firstPlayerId == null ||
          (playOrder == null &&
            (teams == null || playerIds!.length !== 4))) && (
          <em> (by play order)</em>
        )}
        :
      </Typography>
      <Grid container component="figure" spacing={1} alignItems="center">
        {React.Children.toArray(
          playerAvatars(
            playerIds!,
            playOrder,
            firstPlayerId,
            teamPlay ?? false,
            teams
          ).map((player, index) => (
            <>
              <Grid item xs={4}>
                {player}
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body2">
                  {STARTING_MONEY_BASE +
                    (isNoStartingResourcesVariantEnabled
                      ? NO_RESOURCES_VARIANT_EXTRA
                      : 0) +
                    index}{" "}
                  Sestertii{teamPlay && " each"}
                </Typography>
              </Grid>
            </>
          ))
        )}
      </Grid>
    </>
  );
}

function playerAvatars(
  playerIds: readonly PlayerId[],
  playOrder: readonly PlayerId[] | null | undefined,
  firstPlayerId: PlayerId | null | undefined,
  teamPlay: boolean,
  teams: Readonly<Teams> | null | undefined
): readonly JSX.Element[] {
  let order: readonly (PlayerId | null | undefined)[];

  if (firstPlayerId != null) {
    if (playOrder != null) {
      // We have the maximum information needed
      order = fullPlayOrder(playerIds, playOrder, firstPlayerId);
    } else if (teamPlay && playerIds.length === 4) {
      // When we know the first player and there are only 2 teams of 2 we can
      // provide additional information to the user even without the play order.
      if (teams == null) {
        // If don't have the teams we can still give a helpful names to the
        // teams
        return [
          <>
            <PlayerAvatar playerId={firstPlayerId} inline />
            's team
          </>,
          <>The other team</>,
        ];
      }

      // And if we have teams we can even fake the order...
      order = fakePlayOrderForTeams(teams, firstPlayerId);
    } else {
      // When team mode isn't enabled, or we have 3 teams we can only provide
      // partial information
      order = partialPlayOrder(playerIds, firstPlayerId, teams);
    }
  } else {
    // Without a first player we can't really say anything interesting.
    order = Vec.fill(playerIds.length, null);
  }

  const avatars = Vec.map(order, (playerId, idx) =>
    playerId != null ? (
      <PlayerAvatar playerId={playerId} />
    ) : (
      <Avatar>
        {idx + 1}
        {Str.number_suffix(idx + 1)}
      </Avatar>
    )
  );

  if (!teamPlay) {
    return avatars;
  }

  // Group the avatars into the teams
  const numTeams = playerIds.length / 2;
  return Vec.map(Vec.range(0, numTeams - 1), (team) => (
    <AvatarGroup>
      {Vec.filter(avatars, (_, index) => index % numTeams === team)}
    </AvatarGroup>
  ));
}

/**
 * We don't know the full play order but we can at least slot some players into
 * the ordering. Each null | undefined in the returned result means a slot that
 * we couldn't tell the player there.
 */
function partialPlayOrder(
  playerIds: readonly PlayerId[],
  firstPlayerId: PlayerId,
  teams: Readonly<Teams> | null | undefined
): readonly (PlayerId | null | undefined)[] {
  // We assume teams are enabled, but it doesn't really matter because the logic
  // would be the same regardless and this keeps it a little cleaner.
  const numTeams = playerIds.length / 2;

  return Vec.concat(
    // Add the first player
    [firstPlayerId],

    // Fill the other slots with nulls, we don't know what players sit in these
    // slots
    Vec.fill(numTeams - 1, null),

    // If we have teams and the first player we can say who sits in this slot
    // (the first player's partner) so we can put them here.
    teams != null && firstPlayerId != null
      ? Vec.filter(
          nullthrows(
            // Find the team with the first player in it
            teams.find((team) => team.includes(firstPlayerId)),
            `None of the teams in ${JSON.stringify(
              teams
            )} contain the first player id ${firstPlayerId}!`
          ),
          // and remove the first player from it. This should leave us with an
          // array containing the first player's partner.
          (x) => x !== firstPlayerId
        )
      : [null],

    // Fill the remaining slots like above.
    Vec.fill(numTeams - 1, null)
  );
}

/**
 * The real play order doesn't matter because the money denomination is just a
 * matter of team order. If we know how the first player is, and who's in each
 * team, it's just a matter of taking "some" order that complies with all of
 * that, it doesn't matter if that's the real order of play.
 */
function fakePlayOrderForTeams(
  teams: Readonly<Teams>,
  firstPlayerId: PlayerId
): readonly PlayerId[] {
  const fakeOrder = Vec.concat(
    Vec.map(teams, (team) => team[0]),
    Vec.map(teams, (team) => team[1])
  );
  const firstPlayerIdx = fakeOrder.indexOf(firstPlayerId);
  return Vec.rotate(fakeOrder, -firstPlayerIdx);
}
