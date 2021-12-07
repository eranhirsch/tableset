import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import {
  Avatar,
  AvatarGroup,
  Badge,
  Box,
  Checkbox,
  Collapse,
  FormControlLabel,
  Stack,
  Switch,
  Typography
} from "@mui/material";
import { C, invariant, Random, Vec } from "common";
import { InstanceCard } from "features/instance/InstanceCard";
import {
  useOptionalInstanceValue,
  useRequiredInstanceValue
} from "features/instance/useInstanceValue";
import { PlayerNameShortAbbreviation } from "features/players/PlayerNameShortAbbreviation";
import { PlayerShortName } from "features/players/PlayerShortName";
import { templateValue } from "features/template/templateSlice";
import createConstantValueMetaStep from "games/core/steps/createConstantValueMetaStep";
import { Query } from "games/core/steps/Query";
import { GamePiecesColor } from "model/GamePiecesColor";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult
} from "react-beautiful-dnd";
import { playersMetaStep } from ".";
import { useAppSelector } from "../../../app/hooks";
import { PlayerAvatar } from "../../../features/players/PlayerAvatar";
import { firstPlayerIdSelector } from "../../../features/players/playersSlice";
import { PlayerId } from "../../../model/Player";
import {
  ConfigPanelProps,
  createRandomGameStep,
  InstanceCardsProps,
  RandomGameStep,
  VariableStepInstanceComponentProps
} from "../../core/steps/createRandomGameStep";
import { BlockWithFootnotes } from "../../core/ux/BlockWithFootnotes";
import { Teams, TeamSelectionStep } from "./createTeamSelectionStep";

const TEAM_COLORS: readonly GamePiecesColor[] = [
  "blue",
  "yellow",
  "red",
  "green",
  "pink",
];

type TemplateConfig = { random: true } | { fixed: readonly PlayerId[] };

interface Options {
  teamSelectionStep?: TeamSelectionStep;
}

const createPlayOrderStep = ({
  teamSelectionStep,
}: Options): RandomGameStep<readonly PlayerId[], TemplateConfig> =>
  createRandomGameStep({
    id: "playOrder",
    labelOverride: "Seating",

    dependencies: [
      playersMetaStep,
      teamSelectionStep?.enablerStep ?? createConstantValueMetaStep(false),
      teamSelectionStep ?? createConstantValueMetaStep(null),
    ],

    isType: (x): x is PlayerId[] =>
      Array.isArray(x) && x.every((y) => typeof y === "string"),

    InstanceVariableComponent: (props) => (
      <InstanceVariableComponent
        {...props}
        teamSelectionStep={teamSelectionStep}
      />
    ),
    InstanceManualComponent: () => (
      <InstanceManualComponent teamSelectionStep={teamSelectionStep} />
    ),

    isTemplatable: (players, teamPlay, teams) =>
      players.willContainNumElements({
        // It's meaningless to talk about order with less than 3 players
        min: 3,
      }) &&
      (teamPlay.canResolveTo(false) || teams.willResolve()),

    resolve: (config, playerIds, teamPlay, teams) =>
      teamPlay
        ? // teamPlay is ON:
          teams == null
          ? // We don't know who's in each team so we can't generate any seating
            null
          : // We can only use the fixed config if it happens to comply with the
          // resolved teams, otherwise we fallback to a random seating (see
          // comment in the UX below)
          "fixed" in config &&
            compliesWithTeams(config.fixed, teams, playerIds!)
          ? config.fixed
          : resolveRandomForTeams(teams, playerIds!)
        : // teamPlay is OFF:
        "fixed" in config
        ? config.fixed
        : resolveRandom(playerIds!),

    onlyResolvableValue: (config) =>
      config != null && "fixed" in config ? config.fixed : undefined,

    initialConfig: (): TemplateConfig => ({ random: true }),

    refresh: (current, players) =>
      "fixed" in current
        ? { fixed: refreshFixedConfig(current.fixed, players) }
        : templateValue("unchanged"),

    ConfigPanel,
    ConfigPanelTLDR,

    InstanceCards,

    instanceAvroType: { type: "array", items: "string" },
  });
export default createPlayOrderStep;

function resolveRandom(playerIds: readonly PlayerId[]): readonly PlayerId[] {
  const seating = Random.shuffle(playerIds);
  return normalize(seating, playerIds);
}

function resolveRandomForTeams(
  teams: Teams,
  playerIds: readonly PlayerId[]
): readonly PlayerId[] {
  // Shuffle the teams
  const shuffled = Random.shuffle(
    // and shuffle each team separately
    Vec.map(teams, (team) => Random.shuffle(team))
  );

  const teamsCount = teams.length;
  const seating = Vec.map(
    Vec.range(0, playerIds.length - 1),
    // Go over the teams in sequence and take the matching team member
    (index) => shuffled[index % teamsCount][Math.floor(index / teamsCount)]
  );

  return normalize(seating, playerIds);
}

function compliesWithTeams(
  order: readonly PlayerId[],
  teams: Teams,
  playerIds: readonly PlayerId[]
): boolean {
  // Add the pivot back to the order
  const withPivot = Vec.concat([C.firstx(playerIds)], order);

  // And create new teams based on the ordering
  const teamsFromOrder = Vec.map(Vec.range(0, teams.length - 1), (teamNum) =>
    Vec.filter(withPivot, (_, index) => index % teams.length === teamNum)
  );

  // Check if the new teams match the existing teams by checking that for every
  // team in the new teams, there exists some team in the old teams such that
  // they have the same members. If they do then this ordering complies with the
  // existing teams.
  return teamsFromOrder.every((team) =>
    teams.some((t) => Vec.is_equal_multiset(t, team))
  );
}

function ConfigPanel({
  config,
  queries: [players, teamPlay, teams],
  onChange,
}: ConfigPanelProps<
  TemplateConfig,
  readonly PlayerId[],
  boolean,
  Teams
>): JSX.Element {
  const playerIds = players.onlyResolvableValue()!;

  const fixedOrder = useMemo(
    () =>
      "fixed" in config
        ? // Rebuild the full ordering by adding the pivot back
          Vec.concat(Vec.take(playerIds, 1), config.fixed)
        : null,
    [config, playerIds]
  );

  return (
    <Stack direction="column" spacing={1}>
      <Collapse in={fixedOrder != null}>
        <FixedSelector
          order={fixedOrder ?? playerIds}
          playerIds={playerIds}
          onChange={(order) => onChange({ fixed: normalize(order, playerIds) })}
          queries={[teamPlay, teams]}
        />
      </Collapse>
      <FormControlLabel
        sx={{ alignSelf: "center" }}
        label="Random"
        control={<Switch />}
        checked={"random" in config}
        onChange={() =>
          onChange((current) =>
            "fixed" in current
              ? { random: true }
              : { fixed: normalize(playerIds, playerIds) }
          )
        }
      />
    </Stack>
  );
}

function FixedSelector({
  order,
  playerIds,
  onChange,
  queries: [teamPlay, teams],
}: {
  order: readonly PlayerId[];
  playerIds: readonly PlayerId[];
  onChange(order: readonly PlayerId[]): void;
  queries: [Query<boolean>, Query<Teams>];
}): JSX.Element {
  const [showTeams, setShowTeams] = useState(!teamPlay.canResolveTo(false));

  const playerReorderer = (
    <PlayerReorderer
      currentOrder={order}
      onChange={onChange}
      numTeams={teams.willResolve() && showTeams ? teams.count() : 1}
      actualTeams={
        teams.willResolve() ? teams.onlyResolvableValue() : undefined
      }
    />
  );

  if (!teamPlay.canResolveTo(true)) {
    // No team play shenanigans to support
    return playerReorderer;
  }

  return (
    <Stack
      direction="column"
      alignItems="center"
      textAlign="center"
      paddingX={1}
    >
      {playerReorderer}
      {!teams.willResolve() ? (
        <Typography color="error" variant="caption">
          <strong>Ignored</strong> when the Team variant is used.
        </Typography>
      ) : (
        <>
          {teamPlay.canResolveTo(false) && (
            // Only provide a controller if there are two modes available for
            // team play.
            <FormControlLabel
              sx={{ alignSelf: "center" }}
              label="Show Teams"
              control={<Checkbox size="small" />}
              checked={showTeams}
              onChange={() => setShowTeams((current) => !current)}
            />
          )}
          {showTeams && (
            <TeamWarning
              order={order}
              playerIds={playerIds}
              actualTeams={teams.onlyResolvableValue()}
            />
          )}
        </>
      )}
    </Stack>
  );
}

function TeamWarning({
  order,
  playerIds,
  actualTeams,
}: {
  order: readonly PlayerId[];
  playerIds: readonly PlayerId[];
  actualTeams: Teams | undefined;
}): JSX.Element | null {
  if (actualTeams == null) {
    // We don't have the actual teams (it's going to be randomized) so we can't
    // promise anything about the current seating.
    return (
      <Typography color="error" variant="caption">
        <strong>Random</strong> if the seating does't match the chosen teams.
      </Typography>
    );
  }

  if (compliesWithTeams(normalize(order, playerIds), actualTeams, playerIds)) {
    // The seating matches the team structure so we don't need to tell the user
    // anything.
    return null;
  }

  return (
    <Typography color="error" variant="caption" paddingX={5}>
      Current order does not comply with the teams; players in the same team
      should sit opposite one another. A <strong>random</strong> order would be
      used <em>instead</em>.
    </Typography>
  );
}

function PlayerReorderer({
  currentOrder,
  onChange,
  numTeams,
  actualTeams,
}: {
  currentOrder: readonly PlayerId[];
  onChange(newOrder: readonly PlayerId[]): void;
  numTeams: number;
  actualTeams: Teams | undefined;
}): JSX.Element {
  const pivotIndex = useRef(0);

  const orderRotated = Vec.rotate(currentOrder, pivotIndex.current);

  const onDragEnd = useCallback(
    ({ reason, source, destination }: DropResult) => {
      if (reason === "CANCEL") {
        return;
      }

      if (destination == null) {
        // Dropped out of the droppable
        return;
      }

      const srcIdx = source.index;
      const dstIdx = destination.index;

      if (srcIdx === dstIdx) {
        // Trivial
        return;
      }

      onChange(moveItem(orderRotated, srcIdx, dstIdx));

      // recalibrate pivot index
      const currPivotIdx = pivotIndex.current;

      if (srcIdx === currPivotIdx) {
        // We are moving the pivot itself
        pivotIndex.current = dstIdx;
      } else if (srcIdx < currPivotIdx) {
        if (dstIdx >= currPivotIdx) {
          // We are moving a player from an index before the pivot to an index
          // after the pivot, so the pivot will have to make room for it
          pivotIndex.current -= 1;
        }
      } else if (dstIdx <= currPivotIdx) {
        // We are moving a player from an index after the pivot to an index
        // before the pivot, so the pivot will have to make room for it.
        pivotIndex.current += 1;
      }
    },
    [orderRotated, onChange]
  );

  return (
    <Stack alignItems="center" direction="column" spacing={1}>
      <Stack direction="row" spacing={1}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="order" direction="horizontal">
            {(provided) => (
              <Stack
                ref={provided.innerRef}
                {...provided.droppableProps}
                component="ol"
                direction="row"
                sx={{ padding: 0 }}
                spacing={1}
              >
                {orderRotated.map((playerId, idx) => (
                  <DraggablePlayer
                    key={playerId}
                    playerId={playerId}
                    index={idx}
                    teamNumber={
                      actualTeams != null
                        ? actualTeams.findIndex((team) =>
                            team.includes(playerId)
                          )
                        : numTeams > 1
                        ? idx % numTeams
                        : undefined
                    }
                  />
                ))}
                {provided.placeholder}
              </Stack>
            )}
          </Droppable>
        </DragDropContext>
      </Stack>
      <Typography variant="caption">In clockwise order.</Typography>
    </Stack>
  );
}

function moveItem<T>(
  items: readonly T[],
  itemIdx: number,
  targetIdx: number
): T[] {
  const clone = items.slice();
  const [item] = clone.splice(itemIdx, 1);
  clone.splice(targetIdx, 0, item);
  return clone;
}

function DraggablePlayer({
  playerId,
  index,
  teamNumber,
}: {
  playerId: PlayerId;
  index: number;
  teamNumber: number | undefined;
}) {
  return (
    <Draggable draggableId={`${playerId}`} index={index}>
      {(provided) =>
        teamNumber == null ? (
          <Avatar
            component="li"
            ref={provided.innerRef}
            {...provided.dragHandleProps}
            {...provided.draggableProps}
          >
            <PlayerNameShortAbbreviation playerId={playerId} />
          </Avatar>
        ) : (
          <Badge
            color={TEAM_COLORS[teamNumber]}
            invisible={false}
            overlap="circular"
            badgeContent={teamNumber + 1}
            ref={provided.innerRef}
            {...provided.dragHandleProps}
            {...provided.draggableProps}
          >
            <PlayerAvatar playerId={playerId} />
          </Badge>
        )
      }
    </Draggable>
  );
}

function InstanceVariableComponent({
  value: playOrder,
  teamSelectionStep,
}: VariableStepInstanceComponentProps<readonly PlayerId[]> & {
  teamSelectionStep?: TeamSelectionStep;
}): JSX.Element {
  const firstPlayerId = useAppSelector(firstPlayerIdSelector);
  const teams = useOptionalInstanceValue(
    teamSelectionStep ?? createConstantValueMetaStep(null)
  );

  const [showTeams, setShowTeams] = useState(false);

  const avatars = Vec.map(
    Vec.concat([firstPlayerId], playOrder),
    (playerId, index) =>
      showTeams && teams != null ? (
        <Badge
          key={playerId}
          color={TEAM_COLORS[index % teams.length]}
          invisible={false}
          overlap="circular"
          badgeContent={(index % teams.length) + 1}
        >
          <PlayerAvatar playerId={playerId} />
        </Badge>
      ) : (
        <PlayerAvatar playerId={playerId} />
      )
  );

  return (
    <>
      <Typography variant="body1">
        Sit players clockwise around the table in the following order:
      </Typography>
      <Stack direction="column" spacing={1} alignItems="center">
        {showTeams ? (
          <Stack direction="row" spacing={1}>
            {avatars}
          </Stack>
        ) : (
          <AvatarGroup max={playOrder.length + 1}>{avatars}</AvatarGroup>
        )}
        {teams != null && (
          <FormControlLabel
            control={
              <Checkbox
                onChange={() => setShowTeams((current) => !current)}
                checked={showTeams}
              />
            }
            label={"Show Teams?"}
          />
        )}
      </Stack>
    </>
  );
}

function InstanceManualComponent({
  teamSelectionStep,
}: {
  teamSelectionStep?: TeamSelectionStep;
}): JSX.Element {
  const teamPlay = useRequiredInstanceValue(
    teamSelectionStep?.enablerStep ?? createConstantValueMetaStep(false)
  );
  const teams = useOptionalInstanceValue(
    teamSelectionStep ?? createConstantValueMetaStep(null)
  );

  return (
    <BlockWithFootnotes
      footnotes={[
        <>
          Players would play in <strong>clockwise</strong> order around the
          table.
        </>,
        teamPlay || teams != null ? (
          <>
            e.g. if there are 3 groups sit someone from the first group, then
            someone from a different group to the left of them, and someone from
            the last group left of them; only then sit the next members of each
            group, continuing around the table, and maintaining the same order
            of groups as the first round. Continue until everyone is seated.
            <br />A - B - C - A - B - C - A - B...
          </>
        ) : (
          <></>
        ),
      ]}
    >
      {(Footnote) => (
        <>
          Choose a seat around the table for each player
          <Footnote index={1} />.{" "}
          {(teamPlay || teams != null) && (
            <>
              Players on the same team should sit across the table from one
              another so that, going around the table, teams play in the same
              order
              <Footnote index={2} />.
            </>
          )}
        </>
      )}
    </BlockWithFootnotes>
  );
}

function ConfigPanelTLDR({
  config,
}: {
  config: Readonly<TemplateConfig>;
}): JSX.Element {
  const firstPlayerId = useAppSelector(firstPlayerIdSelector);

  if ("random" in config) {
    return <>Random</>;
  }

  return (
    <>
      {React.Children.toArray(
        Vec.map(Vec.concat([firstPlayerId], config.fixed), (playerId, idx) => (
          <>
            {idx > 0 && (
              <NavigateNextIcon
                fontSize="small"
                sx={{ verticalAlign: "middle" }}
              />
            )}
            <PlayerShortName playerId={playerId} />
          </>
        ))
      )}
    </>
  );
}

function InstanceCards({
  value: order,
  dependencies: [playerIds, _isTeams, _teams],
  onClick,
}: InstanceCardsProps<
  readonly PlayerId[],
  readonly PlayerId[],
  boolean,
  Teams
>): JSX.Element {
  const pivot = playerIds![0];
  return (
    <InstanceCard title="Seating" playerId={pivot} onClick={onClick}>
      <Stack direction="column" alignItems="center" spacing={0.5}>
        <Box display="flex" gap={0.5}>
          <PlayerAvatar playerId={pivot} size={24} />
          {Vec.map(
            Vec.take(order, Math.ceil(order.length / 2) - 1),
            (playerId) => (
              <PlayerAvatar key={playerId} playerId={playerId} size={24} />
            )
          )}
        </Box>
        <Box display="flex" gap={0.5}>
          {Vec.map(
            Vec.drop(order, Math.ceil(order.length / 2) - 1),
            (playerId) => (
              <PlayerAvatar key={playerId} playerId={playerId} size={24} />
            )
          )}
        </Box>
      </Stack>
    </InstanceCard>
  );
}

function refreshFixedConfig(
  current: readonly PlayerId[],
  players: Query<readonly PlayerId[]>
): readonly PlayerId[] {
  const playerIds = players.onlyResolvableValue()!;

  // Keep only the values in current which are still players
  const currentRefreshed = Vec.intersect(current, playerIds);
  const missing = Vec.diff(playerIds, current);

  const [newPivot] = playerIds;

  const newOrder = currentRefreshed.includes(newPivot)
    ? // The old pivot was most likely removed, that's why the new pivot is
      // already in the ordering, we simply take the old ordering as is, and add
      // any new players that might have been added
      Vec.concat(currentRefreshed, missing)
    : missing.length === 1
    ? // The current is only missing one element and the new pivot isn't part
      // of current so we can assume that there were no changes at all and we
      // simply need to rebuild the full order by reattaching the pivot.
      // Another scenario is that the old pivot was removed and a new player was
      // added that is now the pivot, in this case we would need to rotate the
      // order so that the new pivot is last in order (and not first), but
      // because there's no way for us to tell the two scenarios apart, and the
      // latter is rarer, we'll just ignore that case altogether.
      Vec.concat([newPivot], currentRefreshed)
    : missing.length === 2
    ? // The 2 missing players are a new player that should be a pivot instead
      // of the old pivot, and the old pivot itself that because of
      // normalization was not part of the ordering. This means that we can
      // assume that the new pivot is the new player, and the other missing
      // player is the old pivot.
      Vec.concat([missing[1]], currentRefreshed, [newPivot])
    : // We can't know for sure who the old pivot was, so we can't fix the
      // ordering
      templateValue("unfixable");

  return normalize(newOrder, playerIds);
}

/**
 * We normalize the order array by rotating it so that the first player in our
 * players array is also the first player in the order. We then remove the pivot
 * player altogether as it's presence is redundant
 */
function normalize(
  order: readonly PlayerId[],
  playerIds: readonly PlayerId[]
): readonly PlayerId[] {
  const pivot = C.firstx(playerIds);
  const pivotIndex = order.indexOf(pivot);
  invariant(pivotIndex !== -1, `Pivot ${pivot} not found in order ${order}`);
  const [, ...pivoted] = Vec.rotate(order, -pivotIndex);
  return pivoted;
}
