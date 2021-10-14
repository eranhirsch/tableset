import LockIcon from "@mui/icons-material/Lock";
import {
  Avatar,
  AvatarGroup,
  Badge,
  Box,
  Checkbox,
  FormControlLabel,
  Stack,
  Typography,
} from "@mui/material";
import { Vec } from "common";
import { PlayerNameShortAbbreviation } from "features/players/PlayerNameShortAbbreviation";
import { ConfigPanelProps } from "features/template/Templatable";
import { templateValue } from "features/template/templateSlice";
import { playersMetaStep } from "games/core/steps/createPlayersDependencyMetaStep";
import { Query } from "games/core/steps/Query";
import React, { useCallback, useMemo } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { useAppSelector } from "../../../app/hooks";
import { PlayerAvatar } from "../../../features/players/PlayerAvatar";
import { firstPlayerIdSelector } from "../../../features/players/playersSlice";
import { PlayerId } from "../../../model/Player";
import {
  createRandomGameStep,
  VariableStepInstanceComponentProps,
} from "../../core/steps/createRandomGameStep";
import { BlockWithFootnotes } from "../../core/ux/BlockWithFootnotes";

type TemplateConfig = { random: true } | { fixed: readonly PlayerId[] };

export default createRandomGameStep({
  id: "playOrder",
  labelOverride: "Seating",

  dependencies: [playersMetaStep],

  isType: (x): x is PlayerId[] =>
    Array.isArray(x) && x.every((y) => typeof y === "string"),

  InstanceVariableComponent,
  InstanceManualComponent,

  isTemplatable: (players) =>
    players.count({
      // It's meaningless to talk about order with less than 3 players
      min: 3,
    }),

  resolve: (config: TemplateConfig, playerIds) =>
    "fixed" in config ? config.fixed : Vec.shuffle(playerIds!.slice(1)),

  initialConfig: (players) => ({ fixed: defaultPlayOrder(players) }),

  refresh: (current, players) =>
    "fixed" in current
      ? { fixed: refreshFixedConfig(current.fixed, players) }
      : templateValue("unchanged"),

  ConfigPanel,
});

const defaultPlayOrder = (
  players: Query<readonly PlayerId[]>
): readonly PlayerId[] => players.resolve().slice(1);

function ConfigPanel({
  config,
  queries: [players],
  onChange,
}: ConfigPanelProps<TemplateConfig, readonly PlayerId[]>): JSX.Element {
  const initialFixed = useMemo(() => defaultPlayOrder(players), [players]);
  return (
    <Stack direction="column" spacing={1}>
      <FixedSelector
        currentOrder={
          config != null && "fixed" in config ? config.fixed : initialFixed
        }
        disabled={config == null || "random" in config}
        onChange={(newOrder) => onChange({ fixed: newOrder })}
      />
      <FormControlLabel
        sx={{ alignSelf: "center" }}
        control={
          <Checkbox
            checked={config != null && "random" in config}
            onChange={(_, checked) =>
              onChange(checked ? { random: true } : { fixed: initialFixed })
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
}: {
  currentOrder: readonly PlayerId[];
  onChange(newOrder: readonly PlayerId[]): void;
  disabled: boolean;
}): JSX.Element {
  const onDragEnd = useCallback(
    ({ reason, source, destination }: DropResult) => {
      if (reason === "CANCEL") {
        return;
      }

      if (destination == null) {
        // Dropped out of the droppable
        return;
      }

      const value = moveItem(currentOrder, source.index, destination.index);
      onChange(value);
    },
    [currentOrder, onChange]
  );

  return (
    <Stack
      sx={{ opacity: disabled ? 0.5 : 1.0 }}
      alignItems="center"
      direction="column"
      spacing={1}
    >
      <Stack direction="row" spacing={1}>
        <FirstAvatar />
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
                {currentOrder.map((playerId, idx) => (
                  <DraggablePlayer
                    isDragDisabled={disabled}
                    key={playerId}
                    playerId={playerId}
                    index={idx}
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
}: {
  playerId: PlayerId;
  index: number;
  badgeContent?: string;
  isDragDisabled: boolean;
}) {
  return (
    <Draggable
      isDragDisabled={isDragDisabled}
      draggableId={`${playerId}`}
      index={index}
    >
      {(provided) => (
        <Avatar
          component="li"
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
        >
          <PlayerNameShortAbbreviation playerId={playerId} />
        </Avatar>
      )}
    </Draggable>
  );
}

function FirstAvatar() {
  const playerId = useAppSelector(firstPlayerIdSelector);
  return (
    <Badge
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      overlap="circular"
      badgeContent={<LockIcon color="primary" fontSize="small" />}
    >
      <PlayerAvatar playerId={playerId} />
    </Badge>
  );
}

function InstanceVariableComponent({
  value: playOrder,
}: VariableStepInstanceComponentProps<readonly PlayerId[]>): JSX.Element {
  const firstPlayerId = useAppSelector(firstPlayerIdSelector);

  return (
    <>
      <Typography variant="body1">
        Sit players clockwise around the table in the following order:
      </Typography>
      <Box display="flex" component="figure">
        <AvatarGroup>
          <PlayerAvatar playerId={firstPlayerId} />
          {React.Children.toArray(
            playOrder.map((playerId) => <PlayerAvatar playerId={playerId} />)
          )}
        </AvatarGroup>
      </Box>
    </>
  );
}

function InstanceManualComponent(): JSX.Element {
  return (
    <BlockWithFootnotes
      footnote={
        <>
          Players would play in <strong>clockwise</strong> order around the
          table.
        </>
      }
    >
      {(Footnote) => (
        <>
          Choose a seat around the table for each player
          <Footnote />.
        </>
      )}
    </BlockWithFootnotes>
  );
}

// function TemplateLabel({ value }: { value: readonly PlayerId[] }): JSX.Element {
//   const firstPlayerId = useAppSelector(firstPlayerIdSelector);
//   return (
//     <>
//       {React.Children.toArray(
//         [firstPlayerId].concat(value).map((playerId, idx) => (
//           <>
//             <PlayerShortName playerId={playerId} />
//             {idx < value.length && (
//               <NavigateNextIcon
//                 fontSize="small"
//                 sx={{ verticalAlign: "middle" }}
//               />
//             )}
//           </>
//         ))
//       )}
//     </>
//   );
// }

function refreshFixedConfig(
  current: readonly PlayerId[],
  players: Query<readonly PlayerId[]>
): readonly PlayerId[] {
  const playerIds = players.resolve();
  // Remove any deleted players from the current value.
  let currentRefreshed = current.filter((playerId) =>
    playerIds.includes(playerId)
  );

  const [newPivot, ...rest] = playerIds;

  const newPivotIdx = currentRefreshed.indexOf(newPivot);
  if (newPivotIdx > -1) {
    // the current value can contain the pivot only if the previous pivot
    // was removed so we need to re-pivot the current array

    currentRefreshed = currentRefreshed
      // First take all players after the new pivot
      .slice(newPivotIdx + 1)
      // Then add the players who were previously before the new pivot
      .concat(currentRefreshed.slice(0, newPivotIdx));
  }

  const missing = rest.filter((playerId) => !current.includes(playerId));
  return currentRefreshed.concat(missing);
}
