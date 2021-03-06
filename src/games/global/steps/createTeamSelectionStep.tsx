import DeleteIcon from "@mui/icons-material/Delete";
import {
  AvatarGroup,
  Button,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useAppSelector } from "app/hooks";
import { C, invariant, Random, Vec } from "common";
import { InstanceCard } from "features/instance/InstanceCard";
import { InstanceValueStep } from "features/instance/instanceValue";
import { PlayerAvatar } from "features/players/PlayerAvatar";
import { PlayerShortName } from "features/players/PlayerShortName";
import { PlayerId, playersSelectors } from "features/players/playersSlice";
import createConstantValueMetaStep from "games/core/steps/createConstantValueMetaStep";
import {
  ConfigPanelProps,
  createRandomGameStep,
  InstanceCardsProps,
  RandomGameStep,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import React, { useCallback, useMemo, useRef } from "react";
import playersMetaStep from "./playersMetaStep";

export type Teams = readonly (readonly PlayerId[])[];
// Our template config would just be a partial representation of the step output
// where the resolve method would simply fill in the blanks. Keep these
// definitions as separate to allow flexibility to change.
type TemplateConfig = Teams;

interface Options {
  teamSize: number;
  enablerStep?: InstanceValueStep<boolean>;
}

export type TeamSelectionStep = ReturnType<typeof createTeamSelectionStep>;

export default function createTeamSelectionStep({
  teamSize,
  enablerStep = createConstantValueMetaStep(true),
}: Options): RandomGameStep<Teams, TemplateConfig> & {
  enablerStep: NonNullable<Options["enablerStep"]>;
} {
  const step = createRandomGameStep({
    id: "teamSelection",
    labelOverride: "Teams",
    dependencies: [playersMetaStep, enablerStep],

    isType: (x: unknown): x is Teams =>
      Array.isArray(x) && (Vec.is_empty(x) || Array.isArray(C.firstx(x))),

    isTemplatable: (_, isEnabled) => isEnabled.canResolveTo(true),
    initialConfig: (): Readonly<TemplateConfig> => [],
    resolve: (config, playerIds, teamPlay) =>
      teamPlay ? resolve(config, playerIds, teamSize) : null,

    onlyResolvableValue(config, players) {
      if (config == null) {
        // No config, we won't resolve the step anyway
        return;
      }

      const playerIds = players.onlyResolvableValue()!;
      if (Vec.flatten(config).length < playerIds.length - 1) {
        // If we have more than one missing player there are at least 2
        // different ways to slot them, so we can't resolve decisively
        return;
      }

      return resolve(config, playerIds, teamSize);
    },

    refresh: (config, playerIds) =>
      // Remove any players that are not in the game anymore.
      Vec.map(config, (team) =>
        Vec.intersect(team, playerIds.onlyResolvableValue()!)
      ),

    skip: (_, [players, isEnabled]) =>
      !isEnabled || players!.length % teamSize !== 0,

    ConfigPanel: (
      props: ConfigPanelProps<TemplateConfig, readonly PlayerId[], boolean>
    ) => <ConfigPanel {...props} teamSize={teamSize} />,
    ConfigPanelTLDR: (props) => (
      <ConfigPanelTLDR {...props} teamSize={teamSize} />
    ),

    InstanceVariableComponent,
    InstanceManualComponent: () => (
      <InstanceManualComponent teamSize={teamSize} />
    ),

    InstanceCards,

    instanceAvroType: {
      type: "array",
      items: { type: "array", items: "string" },
    },
  });

  return {
    ...step,
    query: (template, context) => ({
      ...step.query(template, context),
      count: () => context.playerIds.length / teamSize,
    }),
    enablerStep,
  };
}

function resolve(
  config: TemplateConfig,
  playerIds: readonly PlayerId[] | null,
  n: number
): Teams {
  // Shuffle the player
  let remainingPlayers = Random.shuffle(
    // Find all players not currently in any team
    Vec.diff(playerIds!, Vec.flatten(config))
  );

  if (Vec.is_empty(remainingPlayers)) {
    return config;
  }

  const teams = Vec.concat(
    // Full teams, these don't have any missing members, use as-is in the
    // output
    Vec.filter(config, ({ length }) => length === n),

    // Partial teams - take all partial teams (that don't have exactly
    // TEAM_SIZE members) and add members from the remainingPlayers list
    Vec.flatten(
      Vec.map(Vec.range(1, n - 1), (k) => {
        // Take all teams of a certain length 'k'
        const partialTeams = Vec.filter(config, ({ length }) => length === k);

        // Create a matching team of length TEAM_SIZE - k
        const numMissingMembers = n - k;
        const missingMembers = Vec.chunk(remainingPlayers, numMissingMembers);

        // Pair a partial team and the missing members, then flatten the results
        // into a single array
        const fullTeams = Vec.map(
          Vec.zip(partialTeams, missingMembers),
          Vec.flatten
        );

        // Update the remainingPlayers to reflect the ones we just used
        remainingPlayers = Vec.drop(
          remainingPlayers,
          partialTeams.length * numMissingMembers
        );

        return fullTeams;
      })
    ),

    // Add any remaining players as full teams
    Vec.chunk(remainingPlayers, n)
  );

  return normalize(teams, playerIds!);
}

function ConfigPanel({
  config,
  queries: [players],
  onChange,
  teamSize,
}: ConfigPanelProps<TemplateConfig, readonly PlayerId[], boolean> & {
  teamSize: number;
}): JSX.Element {
  const remainingPlayerIds = useMemo(
    () => Vec.diff(players.onlyResolvableValue()!, Vec.flatten(config)),
    [config, players]
  );

  const onPlayerAdded = useCallback(
    (playerId: PlayerId, team: readonly PlayerId[]) =>
      onChange((current) => {
        // Find the team index in the current config
        const currentTeamIndex = current.findIndex((t) =>
          // TODO: We can loosen this check by looking for an intersecting
          // group instead of equal one, that will make this code more
          // robust in extreme cases where the team has already been
          // changed when we look for it.
          Vec.equal(team, t)
        );
        invariant(
          currentTeamIndex > -1,
          `Team ${team} is missing from the current config ${current}`
        );
        return normalize(
          Vec.concat(
            // Take all elements up to the current team
            Vec.take(current, currentTeamIndex),
            // Add the new playerId to the team
            [Vec.concat(team, playerId)],
            // Take all elements after the current team.
            Vec.drop(current, currentTeamIndex + 1)
          ),
          players.onlyResolvableValue()!
        );
      }),
    [onChange, players]
  );

  const onPlayerRemoved = useCallback(
    (removedPlayerId: PlayerId) =>
      onChange((current) =>
        normalize(
          Vec.map(current, (team) =>
            Vec.filter(team, (playerId) => playerId !== removedPlayerId)
          ),
          players.onlyResolvableValue()!
        )
      ),
    [onChange, players]
  );

  const onTeamDeleted = useCallback(
    (team: readonly PlayerId[]) =>
      onChange((current) =>
        normalize(
          Vec.filter(
            current,
            (t) =>
              // TODO: We can loosen this check by looking for an intersecting
              // group instead of equal one, that will make this code more
              // robust in extreme cases where the team has already been
              // changed when we look for it.
              !Vec.equal(team, t)
          ),
          players.onlyResolvableValue()!
        )
      ),
    [onChange, players]
  );

  const onTeamCreated = useCallback(
    () =>
      onChange((current) =>
        normalize(
          Vec.concat(current, [Random.sample(remainingPlayerIds, 1)]),
          players.onlyResolvableValue()!
        )
      ),
    [onChange, players, remainingPlayerIds]
  );

  // Maintaining the order of the groups while editing them to overcome\
  // reordering because of normalization:
  const internalConfig = useRef(config);
  internalConfig.current = Vec.sort_by(config, (team) => {
    // For each team in `config` we find the index in the `internalConfig` for
    // a team that intersects with it; because both when we add a new member to
    // that team, and when we remove one, the group of remaining members would
    // still intersect with it (assuming we don't allow to remove all members!),
    // and there should only be one team like it because all teams are
    // completely different from one another.
    const currentIndex = internalConfig.current.findIndex(
      (internalTeam) => !Vec.is_empty(Vec.intersect(internalTeam, team))
    );
    return currentIndex > -1
      ? // If the team was found, it should be located in the same index
        currentIndex
      : // If it wasn't, it is a new group and should be added at the end
        99999;
  });

  return (
    <Grid container rowSpacing={1}>
      {React.Children.toArray(
        Vec.map(internalConfig.current, (team, index) => (
          <>
            {index > 0 && (
              <Grid item xs={12}>
                <Divider variant="middle" />
              </Grid>
            )}
            <IndividualTeamConfigPanel
              team={team}
              remainingPlayerIds={remainingPlayerIds}
              onPlayerAdded={onPlayerAdded}
              onPlayerRemoved={onPlayerRemoved}
              onDelete={onTeamDeleted}
              teamSize={teamSize}
            />
          </>
        ))
      )}
      {config.length < players.onlyResolvableValue()!.length / teamSize && (
        <Grid item xs={12} alignSelf="center" textAlign="center">
          <Button onClick={onTeamCreated}>+ Add Fixed Team</Button>
        </Grid>
      )}
    </Grid>
  );
}

function IndividualTeamConfigPanel({
  team,
  remainingPlayerIds,
  onPlayerAdded,
  onPlayerRemoved,
  onDelete,
  teamSize,
}: {
  team: readonly PlayerId[];
  remainingPlayerIds: readonly PlayerId[];
  onPlayerAdded(playerId: PlayerId, team: readonly PlayerId[]): void;
  onPlayerRemoved(playerId: PlayerId): void;
  onDelete(team: readonly PlayerId[]): void;
  teamSize: number;
}): JSX.Element {
  const isFull = team.length === teamSize;

  const avatars = Vec.map(
    isFull ? team : Vec.concat(team, remainingPlayerIds),
    (playerId) => (
      <PlayerAvatar
        playerId={playerId}
        sx={{ opacity: team.includes(playerId) ? 1.0 : 0.25 }}
        onClick={
          team.includes(playerId)
            ? team.length > 1
              ? () => onPlayerRemoved(playerId)
              : undefined
            : team.length < teamSize
            ? () => onPlayerAdded(playerId, team)
            : undefined
        }
      />
    )
  );

  return (
    <>
      <Grid item xs={11} alignSelf="center">
        {isFull ? (
          <AvatarGroup sx={{ justifyContent: "center" }}>{avatars}</AvatarGroup>
        ) : (
          <Stack
            direction="row"
            spacing={0.5}
            alignItems="center"
            justifyContent="center"
          >
            {avatars}
          </Stack>
        )}
      </Grid>
      <Grid item xs={1} alignSelf="center">
        <IconButton size="small" onClick={() => onDelete(team)}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Grid>
    </>
  );
}

function ConfigPanelTLDR({
  config,
  teamSize,
}: {
  config: Readonly<TemplateConfig>;
  teamSize: number;
}): JSX.Element {
  const playersCount = useAppSelector(playersSelectors.selectTotal);

  if (Vec.is_empty(config)) {
    return <>Random</>;
  }

  const groupsCount = playersCount / teamSize;

  return (
    <>
      {Vec.map(config, (team, index) => (
        <>
          {index > 0 && <em> VS </em>}
          {team.length === teamSize ? (
            <GrammaticalList>
              {Vec.map(team, (playerId) => (
                <PlayerShortName playerId={playerId} />
              ))}
            </GrammaticalList>
          ) : (
            <>
              Team <PlayerShortName playerId={C.firstx(team)} />
            </>
          )}
        </>
      ))}
      {config.length < groupsCount && (
        <>
          {" "}
          <em>VS</em> the other team{config.length < groupsCount - 1 && "s"}
        </>
      )}
    </>
  );
}

function InstanceVariableComponent({
  value: teams,
}: VariableStepInstanceComponentProps<Teams>): JSX.Element {
  return (
    <>
      <Typography variant="body1">
        Players are paired in the following teams:
      </Typography>
      <Stack direction="row" justifyContent="space-around">
        {Vec.map(teams, (team, index) => (
          <AvatarGroup key={`team_${index}`}>
            {Vec.map(team, (playerId) => (
              <PlayerAvatar key={playerId} playerId={playerId} />
            ))}
          </AvatarGroup>
        ))}
      </Stack>
    </>
  );
}

function InstanceManualComponent({
  teamSize,
}: {
  teamSize: number;
}): JSX.Element {
  const playersCount = useAppSelector(playersSelectors.selectTotal);
  return (
    <Typography variant="body1">
      Players split into <em>({playersCount / teamSize})</em> teams consisting
      of <em>exactly</em> <strong>{teamSize}</strong> players each.
    </Typography>
  );
}

function InstanceCards({
  value: teams,
  dependencies: [_playerIds, _isEnabled],
  onClick,
}: InstanceCardsProps<Teams, readonly PlayerId[], boolean>): JSX.Element {
  return (
    <>
      {Vec.map(teams, ([head, ...rest], index) => (
        <InstanceCard
          key={`team_${head}`}
          title="Team"
          playerId={head}
          onClick={onClick}
        >
          <AvatarGroup>
            <PlayerAvatar playerId={head} />
            {Vec.map(rest, (playerId) => (
              <PlayerAvatar playerId={playerId} />
            ))}
          </AvatarGroup>
        </InstanceCard>
      ))}
    </>
  );
}

/**
 * Normalize a teams array so that we always store a canonical representation of
 * it.
 */
const normalize = (teams: Teams, playerIds: readonly PlayerId[]): Teams =>
  Vec.sort_by(
    // First, sort each team internally by player name (via the playerIds array)
    Vec.map(teams, (team) =>
      Vec.sort_by(team, (playerId) => playerIds.indexOf(playerId))
    ),
    // Then sort the teams themselves by player name (via the playerIds array)
    ([playerId]) => playerIds.indexOf(playerId)
  );
