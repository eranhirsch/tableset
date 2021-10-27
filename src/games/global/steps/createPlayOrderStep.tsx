import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import {
  Avatar,
  AvatarGroup,
  Badge,
  Checkbox,
  FormControlLabel,
  Stack,
  Typography,
} from "@mui/material";
import { C, invariant, Vec } from "common";
import { useOptionalInstanceValue } from "features/instance/useInstanceValue";
import { PlayerNameShortAbbreviation } from "features/players/PlayerNameShortAbbreviation";
import { PlayerShortName } from "features/players/PlayerShortName";
import { ConfigPanelProps } from "features/template/Templatable";
import { templateValue } from "features/template/templateSlice";
import { Query } from "games/core/steps/Query";
import { GamePiecesColor } from "model/GamePiecesColor";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { neverResolvesMetaStep, playersMetaStep } from ".";
import { useAppSelector } from "../../../app/hooks";
import { PlayerAvatar } from "../../../features/players/PlayerAvatar";
import { firstPlayerIdSelector } from "../../../features/players/playersSlice";
import { PlayerId } from "../../../model/Player";
import {
  createRandomGameStep,
  RandomGameStep,
  VariableStepInstanceComponentProps,
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
  teamSelectionStep = neverResolvesMetaStep as TeamSelectionStep,
}: Options): RandomGameStep<readonly PlayerId[], TemplateConfig> =>
  createRandomGameStep({
    id: "playOrder",
    labelOverride: "Seating",

    dependencies: [playersMetaStep, teamSelectionStep],

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

    isTemplatable: (players) =>
      players.willContainNumElements({
        // It's meaningless to talk about order with less than 3 players
        min: 3,
      }),

    resolve: (config, playerIds, teams) =>
      "fixed" in config &&
      (teams == null || compliesWithTeams(config.fixed, teams, playerIds!))
        ? config.fixed
        : normalize(
            teams == null
              ? // For non-team games we just shuffle the players
                Vec.shuffle(playerIds!)
              : resolveForTeams(teams, playerIds!.length),
            playerIds!
          ),

    initialConfig: (): TemplateConfig => ({ random: true }),

    refresh: (current, players) =>
      "fixed" in current
        ? { fixed: refreshFixedConfig(current.fixed, players) }
        : templateValue("unchanged"),

    ConfigPanel,
    ConfigPanelTLDR,
  });
export default createPlayOrderStep;

function resolveForTeams(
  teams: Teams,
  playersCount: number
): readonly PlayerId[] {
  // Shuffle the teams
  const shuffled = Vec.shuffle(
    // and shuffle each team separately
    Vec.map(teams, (team) => Vec.shuffle(team))
  );

  const teamsCount = teams.length;
  return Vec.map(
    Vec.range(0, playersCount - 1),
    // Go over the teams in sequence and take the matching team member
    (index) => shuffled[index % teamsCount][Math.floor(index / teamsCount)]
  );
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
    teams.some((t) => Vec.equal_multiset(t, team))
  );
}

function ConfigPanel({
  config,
  queries: [players, teams],
  onChange,
}: ConfigPanelProps<TemplateConfig, readonly PlayerId[], Teams>): JSX.Element {
  const playerIds = players.resolve();

  const currentOrder = useMemo(
    () =>
      "fixed" in config
        ? // Rebuild the full ordering by adding the pivot back
          Vec.concat(Vec.take(playerIds, 1), config.fixed)
        : playerIds,
    [config, playerIds]
  );

  return (
    <Stack direction="column" spacing={1}>
      <FixedSelector
        currentOrder={currentOrder}
        disabled={"random" in config}
        onChange={(newOrder) =>
          onChange({ fixed: normalize(newOrder, playerIds) })
        }
        numTeams={teams.willResolve() ? teams.count() : 1}
      />
      <FormControlLabel
        sx={{ alignSelf: "center" }}
        control={
          <Checkbox
            checked={"random" in config}
            onChange={() =>
              onChange((current) =>
                "fixed" in current
                  ? { random: true }
                  : { fixed: normalize(currentOrder, playerIds) }
              )
            }
          />
        }
        label="Random"
      />
    </Stack>
  );
}

function FixedSelector({
  currentOrder,
  onChange,
  disabled,
  numTeams,
}: {
  currentOrder: readonly PlayerId[];
  onChange(newOrder: readonly PlayerId[]): void;
  disabled: boolean;
  numTeams: number;
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
    <Stack
      sx={{ opacity: disabled ? 0.5 : 1.0 }}
      alignItems="center"
      direction="column"
      spacing={1}
    >
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
                    isDragDisabled={disabled}
                    key={playerId}
                    playerId={playerId}
                    index={idx}
                    teamNumber={numTeams > 1 ? idx % numTeams : undefined}
                  />
                ))}
                {provided.placeholder}
              </Stack>
            )}
          </Droppable>
        </DragDropContext>
      </Stack>
      <Typography variant="caption">{"In clockwise order"}</Typography>
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
  isDragDisabled,
  teamNumber,
}: {
  playerId: PlayerId;
  index: number;
  isDragDisabled: boolean;
  teamNumber: number | undefined;
}) {
  return (
    <Draggable
      isDragDisabled={isDragDisabled}
      draggableId={`${playerId}`}
      index={index}
    >
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
  teamSelectionStep: TeamSelectionStep;
}): JSX.Element {
  const firstPlayerId = useAppSelector(firstPlayerIdSelector);
  const teams = useOptionalInstanceValue(teamSelectionStep);

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
  teamSelectionStep: TeamSelectionStep;
}): JSX.Element {
  const { useRequiredInstanceValue } = teamSelectionStep.enablerStep;
  const teamPlay = useRequiredInstanceValue();
  const teams = useOptionalInstanceValue(teamSelectionStep);

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

function refreshFixedConfig(
  current: readonly PlayerId[],
  players: Query<readonly PlayerId[]>
): readonly PlayerId[] {
  const playerIds = players.resolve();

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
