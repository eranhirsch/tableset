import {
  Avatar,
  Badge,
  Box,
  Checkbox,
  Chip,
  FormControlLabel,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { colorName } from "app/ux/themeWithGameColors";
import { Dict, invariant_violation, Shape, Vec } from "common";
import { useRequiredInstanceValue } from "features/instance/useInstanceValue";
import { PlayerNameShortAbbreviation } from "features/players/PlayerNameShortAbbreviation";
import { PlayerShortName } from "features/players/PlayerShortName";
import { ConfigPanelProps } from "features/template/Templatable";
import { templateValue } from "features/template/templateSlice";
import { playersMetaStep } from "games/core/steps/createPlayersDependencyMetaStep";
import { Query } from "games/core/steps/Query";
import { GamePiecesColor } from "model/GamePiecesColor";
import { PlayerId } from "model/Player";
import React, { useCallback, useMemo } from "react";
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { PlayerAvatar } from "../../../features/players/PlayerAvatar";
import {
  createRandomGameStep,
  VariableStepInstanceComponentProps,
} from "../../core/steps/createRandomGameStep";
import { BlockWithFootnotes } from "../../core/ux/BlockWithFootnotes";
import { GrammaticalList } from "../../core/ux/GrammaticalList";
import { ConcordiaProductId } from "../ConcordiaProductId";
import productsMetaStep from "./productsMetaStep";

const BASE_COLORS: readonly GamePiecesColor[] = [
  "black",
  "blue",
  "green",
  "red",
  "yellow",
];
const VENUS_COLORS: readonly GamePiecesColor[] = ["white"];

type PlayerColors = Readonly<Record<PlayerId, GamePiecesColor>>;

type TemplateConfig = { random: true } | { fixed: PlayerColors };

export default createRandomGameStep({
  id: "colors",

  dependencies: [playersMetaStep, productsMetaStep],

  InstanceVariableComponent,
  InstanceManualComponent,

  isTemplatable: (players, products) =>
    players.count({ max: availableColors(products.resolve()).length }),

  resolve: (config, playerIds, products) =>
    "fixed" in config
      ? config.fixed
      : Dict.associate(
          playerIds!,
          Vec.shuffle(Vec.sample(availableColors(products!), playerIds!.length))
        ),

  initialConfig: (): TemplateConfig => ({
    random: true,
  }),

  refresh: (current, players, products) =>
    "fixed" in current
      ? {
          fixed: refreshFixedConfig(
            current.fixed,
            availableColors(products.resolve()),
            players
          ),
        }
      : templateValue("unchanged"),

  ConfigPanel,
  ConfigPanelTLDR,
});

function ConfigPanel({
  config,
  queries: [players, products],
  onChange,
}: ConfigPanelProps<
  TemplateConfig,
  readonly PlayerId[],
  readonly ConcordiaProductId[]
>): JSX.Element {
  const colors = useMemo(() => availableColors(products.resolve()), [products]);
  const initialFixed = useMemo(
    () => Dict.associate(players.resolve(), colors),
    [colors, players]
  );
  return (
    <Stack direction="column" spacing={1} alignItems="center">
      <FixedSelector
        availableColors={colors}
        currentPlayerColors={
          config != null && "fixed" in config ? config.fixed : initialFixed
        }
        disabled={config == null || "random" in config}
        onChange={(newColors) => onChange({ fixed: newColors })}
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
  availableColors,
  currentPlayerColors,
  onChange,
  disabled,
}: {
  availableColors: readonly GamePiecesColor[];
  currentPlayerColors: PlayerColors;
  disabled: boolean;
  onChange(newColors: PlayerColors): void;
}): JSX.Element | null {
  // We need the data indexed by color too
  const colorPlayerIds = useMemo(
    () => Shape.flip(currentPlayerColors),
    [currentPlayerColors]
  );

  const closestAvailableColor = useCallback(
    (
      start: GamePiecesColor,
      treatAsAvailable: GamePiecesColor
    ): GamePiecesColor => {
      const isSlotAvailable = (slot: number): boolean => {
        const colorAtSlot = availableColors[slot];
        return (
          colorAtSlot != null &&
          (colorAtSlot === treatAsAvailable ||
            colorPlayerIds[colorAtSlot] == null)
        );
      };

      const currentPos = availableColors.findIndex((color) => color === start);

      for (let distance = 1; distance < availableColors.length; distance += 1) {
        if (isSlotAvailable(currentPos - distance)) {
          return availableColors[currentPos - distance];
        }

        if (isSlotAvailable(currentPos + distance)) {
          return availableColors[currentPos + distance];
        }
      }

      invariant_violation("Couldn't find an available color!");
    },
    [availableColors, colorPlayerIds]
  );

  const onDragEnd = useCallback(
    ({ draggableId, source, destination, reason }: DropResult) => {
      if (reason === "CANCEL") {
        return;
      }

      if (destination == null) {
        // User dropped the item outside of any destination
        return;
      }

      const destinationColor = destination.droppableId as GamePiecesColor;
      const newColors = {
        ...currentPlayerColors,
        [draggableId]: destinationColor,
      };

      const destinationPlayer = colorPlayerIds[destinationColor];
      if (destinationPlayer != null && destinationPlayer !== draggableId) {
        // In case the drag caused us to assign a color that is already used by
        // a different player we need to update that player to use a different
        // color.
        newColors[destinationPlayer] = closestAvailableColor(
          destinationColor,
          source.droppableId as GamePiecesColor
        );
      }

      onChange(newColors);
    },
    [closestAvailableColor, colorPlayerIds, currentPlayerColors, onChange]
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Stack
        sx={{ opacity: disabled ? 0.5 : 1.0 }}
        pl={0}
        component="ul"
        direction="row"
        alignItems="center"
        spacing={1}
        height={48}
      >
        {Vec.map(availableColors, (color) => (
          <ColorSlot
            disabled={disabled}
            key={color}
            color={color}
            playerId={colorPlayerIds[color]}
          />
        ))}
      </Stack>
    </DragDropContext>
  );
}

const draggablePlayerRendererFactory =
  (playerId: PlayerId) => (provided: DraggableProvided) =>
    (
      <Avatar
        ref={provided.innerRef}
        {...provided.dragHandleProps}
        {...provided.draggableProps}
      >
        <PlayerNameShortAbbreviation playerId={playerId} />
      </Avatar>
    );

function DraggablePlayer({
  playerId,
  isDragDisabled,
}: {
  playerId: PlayerId;
  isDragDisabled: boolean;
}) {
  return (
    <Draggable isDragDisabled={isDragDisabled} draggableId={playerId} index={0}>
      {draggablePlayerRendererFactory(playerId)}
    </Draggable>
  );
}

function ColorSlot({
  color,
  playerId,
  disabled,
}: {
  color: GamePiecesColor;
  playerId: PlayerId | undefined;
  disabled: boolean;
}) {
  const theme = useTheme();

  return (
    <Droppable
      droppableId={color}
      // We need to clone the dragged item as we move it between lists
      renderClone={
        playerId != null ? draggablePlayerRendererFactory(playerId) : undefined
      }
    >
      {(provided, snapshot) => (
        <Badge
          // We are part of a UL of colors
          component="li"
          ref={provided.innerRef}
          {...provided.droppableProps}
          color={color}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          overlap="circular"
          invisible={
            // We don't need a badge when there's no avatar hiding the
            // background color
            playerId == null ||
            snapshot.isDraggingOver ||
            snapshot.draggingFromThisWith === playerId
          }
        >
          <Avatar
            // We use an avatar component for the colored background because we
            // would "cover" it with another avatar for assigned players
            sx={{
              bgcolor: theme.palette[color].main,

              // Create a transition effect to make the color apparent while
              // being dragged over.
              width: snapshot.isDraggingOver ? 48 : undefined,
              height: snapshot.isDraggingOver ? 48 : undefined,
              transitionProperty: "width, height",
              transitionDuration: `${snapshot.isDraggingOver ? 200 : 65}ms`,
              transitionTimingFunction: "ease-out",
            }}
          >
            {playerId != null &&
              // We need to remove players occupying slots we are dragging so
              // they don't render and move around, but we don't want to do
              // this to the source slot where our item originated from
              (!snapshot.isDraggingOver ||
                snapshot.draggingFromThisWith === playerId) && (
                <DraggablePlayer
                  isDragDisabled={disabled}
                  playerId={playerId}
                />
              )}
            <Box display="none">
              {
                // We hide the placeholder as we don't need it, we have a single
                // item list, and we don't want any animations.
                // react-beautiful-dnd doesn't permit us to remove it entirely!
                provided.placeholder
              }
            </Box>
          </Avatar>
        </Badge>
      )}
    </Droppable>
  );
}

function ConfigPanelTLDR({ config }: { config: TemplateConfig }): JSX.Element {
  if ("random" in config) {
    return <>Random</>;
  }

  return (
    <GrammaticalList>
      {React.Children.toArray(
        Vec.map_with_key(config.fixed, (playerId, color) => (
          <Chip
            component="span"
            size="small"
            color={color}
            label={<PlayerShortName playerId={playerId} />}
          />
        ))
      )}
    </GrammaticalList>
  );
}

function InstanceVariableComponent({
  value: playerColor,
}: VariableStepInstanceComponentProps<PlayerColors>): JSX.Element {
  return (
    <>
      <Typography variant="body1">
        Each player is assigned the following colors:
      </Typography>
      <Stack direction="row" spacing={1} component="figure">
        {Vec.map_with_key(playerColor, (playerId, color) => (
          <Badge
            key={playerId}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            overlap="circular"
            invisible={false}
            color={color}
          >
            <PlayerAvatar playerId={playerId} />
          </Badge>
        ))}
      </Stack>
    </>
  );
}

function InstanceManualComponent(): JSX.Element {
  const products = useRequiredInstanceValue(productsMetaStep);

  const colors = useMemo(() => availableColors(products), [products]);

  return (
    <BlockWithFootnotes
      footnote={
        <>
          Available colors:{" "}
          <GrammaticalList>
            {colors.map((color) => (
              <Chip
                key={`available_color_${color}`}
                variant="filled"
                color={color}
                size="small"
                label={colorName[color]}
              />
            ))}
          </GrammaticalList>
        </>
      }
    >
      {(Footnote) => (
        <>
          Each player picks a color
          <Footnote />.
        </>
      )}
    </BlockWithFootnotes>
  );
}

function refreshFixedConfig(
  current: PlayerColors,
  availableColors: readonly GamePiecesColor[],
  players: Query<readonly PlayerId[]>
): PlayerColors {
  const playerIds = players.resolve();
  const stillActivePlayerColors = Dict.select_keys(current, playerIds);
  const colorlessPlayers = Vec.diff(playerIds, Vec.keys(current));

  return Dict.merge(
    stillActivePlayerColors,
    // Associate an available color for each player without a color
    Dict.associate(
      colorlessPlayers,
      // Colors that aren't used by active players
      Vec.diff(availableColors, Vec.values(stillActivePlayerColors))
    )
  );
}

const availableColors = (
  products: readonly ConcordiaProductId[]
): readonly GamePiecesColor[] =>
  Vec.concat(
    BASE_COLORS,
    products.includes("venus") || products.includes("venusBase")
      ? VENUS_COLORS
      : []
  );
