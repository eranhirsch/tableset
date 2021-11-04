import DeleteIcon from "@mui/icons-material/Delete";
import {
  Avatar,
  Badge,
  Button,
  Chip,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useAppSelector } from "app/hooks";
import { colorName } from "app/ux/themeWithGameColors";
import { Dict, invariant, Random, Vec } from "common";
import { useRequiredInstanceValue } from "features/instance/useInstanceValue";
import { PlayerShortName } from "features/players/PlayerShortName";
import { playersSelectors } from "features/players/playersSlice";
import { ConfigPanelProps } from "features/template/Templatable";
import { templateValue } from "features/template/templateSlice";
import {
  createRandomGameStep,
  RandomGameStep,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { GamePiecesColor } from "model/GamePiecesColor";
import { PlayerId } from "model/Player";
import { VariableGameStep } from "model/VariableGameStep";
import React, { useCallback, useMemo, useRef } from "react";
import { playersMetaStep } from ".";
import { PlayerAvatar } from "../../../features/players/PlayerAvatar";
import { BlockWithFootnotes } from "../../core/ux/BlockWithFootnotes";
import { GrammaticalList } from "../../core/ux/GrammaticalList";

const AVATAR_SIZE = 36;

type TemplateConfig = Record<PlayerId, GamePiecesColor>;

// This is the instance type, it's identical to the TemplateConfig, but it
// doesn't HAVE to be, so don't merge the two type definitions.
type PlayerColors = Readonly<Record<PlayerId, GamePiecesColor>>;

interface Options<ProductId> {
  productsMetaStep: VariableGameStep<readonly ProductId[]>;
  availableColors(
    playerIds: readonly PlayerId[],
    products: readonly ProductId[]
  ): readonly GamePiecesColor[];
}

const createPlayerColorsStep = <ProductId,>({
  productsMetaStep,
  availableColors,
}: Options<ProductId>): RandomGameStep<PlayerColors, TemplateConfig> =>
  createRandomGameStep({
    id: "colors",

    dependencies: [playersMetaStep, productsMetaStep],

    InstanceVariableComponent,
    InstanceManualComponent: () =>
      InstanceManualComponent({ productsMetaStep, availableColors }),

    isTemplatable: (players, products) =>
      players.willContainNumElements({
        max: availableColors(
          players.onlyResolvableValue()!,
          products.onlyResolvableValue()!
        ).length,
      }),

    resolve: (config, players, products) =>
      resolve(config, players!, availableColors(players!, products!)),

    onlyResolvableValue(config, players, products) {
      if (config == null) {
        return;
      }

      const playerIds = players.onlyResolvableValue()!;
      const assignedCount = Dict.size(config);
      if (assignedCount < playerIds.length - 1) {
        // If we have more than one missing player there are at least 2
        // different ways to resolve so we can't resolve decisively
        return;
      }

      const colors = availableColors(
        playerIds,
        products.onlyResolvableValue()!
      );
      if (assignedCount < colors.length - 1) {
        // If we have more than one color to match that person with we can't
        // resolve decisively
        return;
      }

      return resolve(config, playerIds, colors);
    },

    initialConfig: () => ({}),

    refresh: (current, players, products) => {
      const playerIds = players.onlyResolvableValue()!;
      const colors = availableColors(
        playerIds,
        products.onlyResolvableValue()!
      );
      // And also remove all colors which aren't available anymore
      const refreshed = Dict.filter(
        // Create a new dict with only the current players in it, effectively
        // removing all assignments for players that don't exist anymore.
        Dict.select_keys(current, playerIds),
        (color) => colors.includes(color)
      );
      return Dict.size(refreshed) < Dict.size(current)
        ? // Only return a new value if it's different
          refreshed
        : templateValue("unchanged");
    },

    ConfigPanel: ({ config, onChange, queries: [players, products] }) => (
      <ConfigPanel
        config={config}
        onChange={onChange}
        playerIds={players.onlyResolvableValue()!}
        colors={availableColors(
          players.onlyResolvableValue()!,
          products.onlyResolvableValue()!
        )}
      />
    ),
    ConfigPanelTLDR,
  });
export default createPlayerColorsStep;

const resolve = (
  config: TemplateConfig,
  playerIds: readonly PlayerId[],
  availableColors: readonly GamePiecesColor[]
): Readonly<PlayerColors> =>
  normalize(
    {
      ...config,
      // Associate a color for each remaining player
      ...Dict.associate(
        // Players without an assigned color
        Vec.diff(playerIds, Vec.keys(config)),
        // Shuffle the colors which aren't already used
        Random.shuffle(Vec.diff(availableColors, Vec.values(config)))
      ),
    },
    playerIds
  );

function ConfigPanel({
  config,
  onChange,
  playerIds,
  colors,
}: {
  config: Readonly<TemplateConfig>;
  onChange: ConfigPanelProps<TemplateConfig>["onChange"];
  playerIds: readonly PlayerId[];
  colors: readonly GamePiecesColor[];
}): JSX.Element {
  const assignedPlayers = useMemo(() => Vec.keys(config), [config]);

  const order = useRef<readonly PlayerId[]>([]);
  order.current = Vec.concat(
    Vec.intersect(order.current, assignedPlayers),
    Vec.diff(assignedPlayers, order.current)
  );
  const sorted = useMemo(
    () =>
      // We memoize a sorted version of the config to stop the rows from jumping
      // around with the changes.
      normalize(config, order.current),
    [config]
  );

  const remainingPlayerIds = useMemo(
    () => Vec.diff(playerIds, assignedPlayers),
    [assignedPlayers, playerIds]
  );
  const remainingColors = useMemo(
    () => Vec.diff(colors, Vec.values(config)),
    [colors, config]
  );

  const onNewRow = useCallback(() => {
    invariant(
      !Vec.is_empty(remainingPlayerIds) && !Vec.is_empty(remainingColors),
      `Trying to create a new fixed color entry when either players ${remainingPlayerIds} or colors are depleted ${remainingColors}`
    );
    onChange((current) =>
      Dict.sort_by_with_key(
        Dict.merge(current, {
          // When adding a new row we pick a random player and color so that the
          // new row is already valid in our format, otherwise we would need to
          // support empty cases for color and player in our selectors.
          [Vec.sample(remainingPlayerIds, 1)]: Vec.sample(remainingColors, 1),
        } as Readonly<TemplateConfig>),
        // And sort the output so that it remains normalized
        (playerId) => playerIds.indexOf(playerId)
      )
    );
  }, [onChange, playerIds, remainingColors, remainingPlayerIds]);

  return (
    <Grid container rowSpacing={1} paddingY={1}>
      {Vec.map_with_key(sorted, (playerId, color, index) => (
        <React.Fragment key={playerId}>
          {index > 0 && (
            <Grid item xs={12}>
              <Divider variant="middle" />
            </Grid>
          )}
          <IndividualPlayerConfigPanel
            key={playerId}
            playerId={playerId}
            color={color}
            remainingPlayerIds={remainingPlayerIds}
            remainingColors={remainingColors}
            onChange={(newPlayerId, newColor) =>
              onChange((current) =>
                Dict.sort_by_with_key(
                  Dict.merge(
                    // Remove the current entry for the player, we are going to add
                    // a new entry in the config, and it might not be for the same
                    // player id.
                    Dict.filter_with_keys(current, (pid) => pid !== playerId),
                    { [newPlayerId]: newColor } as Readonly<TemplateConfig>
                  ),
                  // We want to normalize the config so that there's always a
                  // SINGLE canonical representation of each user selection.
                  (playerId) => playerIds.indexOf(playerId)
                )
              )
            }
            onDelete={() =>
              onChange((current) =>
                Dict.filter_with_keys(current, (pid) => pid !== playerId)
              )
            }
          />
        </React.Fragment>
      ))}

      {Dict.size(sorted) < playerIds.length && (
        // New row button
        <Grid item xs={12} alignSelf="center" textAlign="center">
          <Button onClick={onNewRow}>+ Add Fixed Color</Button>
        </Grid>
      )}
    </Grid>
  );
}

function IndividualPlayerConfigPanel({
  playerId,
  color,
  remainingPlayerIds,
  remainingColors,
  onChange,
  onDelete,
}: {
  playerId: PlayerId;
  color: GamePiecesColor;
  remainingPlayerIds: readonly PlayerId[];
  remainingColors: readonly GamePiecesColor[];
  onChange(playerId: PlayerId, color: GamePiecesColor): void;
  onDelete(): void;
}): JSX.Element {
  return (
    <>
      <Grid item xs={2} textAlign="center" alignSelf="center">
        <SelectedColor color={color} playerId={playerId} />
      </Grid>
      {!Vec.is_empty(remainingColors) && (
        <Grid
          item
          xs={Vec.is_empty(remainingPlayerIds) ? 8 : 5}
          alignSelf="center"
        >
          <ColorSelector
            availableColors={remainingColors}
            onChange={(newColor) => onChange(playerId, newColor)}
          />
        </Grid>
      )}
      {!Vec.is_empty(remainingPlayerIds) && (
        <Grid item xs={4} alignSelf="center">
          {!Vec.is_empty(remainingPlayerIds) && (
            <PlayerSelector
              playerIds={remainingPlayerIds}
              onChange={(newPlayerId) => onChange(newPlayerId, color)}
            />
          )}
        </Grid>
      )}
      <Grid item xs={1} alignSelf="center">
        <IconButton size="small" onClick={onDelete}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Grid>
    </>
  );
}

function SelectedColor({
  color,
  playerId,
}: {
  color: GamePiecesColor;
  playerId: PlayerId;
}): JSX.Element {
  return (
    <Badge
      color={color}
      invisible={false}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      overlap="circular"
    >
      <PlayerAvatar playerId={playerId} />
    </Badge>
  );
}

function ColorSelector({
  availableColors,
  onChange,
}: {
  availableColors: readonly GamePiecesColor[];
  onChange(color: GamePiecesColor): void;
}): JSX.Element {
  if (availableColors.length < 3) {
    return (
      <ColorSelectorRow availableColors={availableColors} onChange={onChange} />
    );
  }

  const midPoint = Math.floor(availableColors.length / 2);

  return (
    <Stack direction="column" spacing={0.5}>
      <ColorSelectorRow
        availableColors={Vec.take(availableColors, midPoint)}
        onChange={onChange}
      />
      <ColorSelectorRow
        availableColors={Vec.drop(availableColors, midPoint)}
        onChange={onChange}
      />
    </Stack>
  );
}

function ColorSelectorRow({
  availableColors,
  onChange,
}: {
  availableColors: readonly GamePiecesColor[];
  onChange(color: GamePiecesColor): void;
}): JSX.Element {
  const theme = useTheme();

  return (
    <Stack
      direction="row"
      spacing={0.5}
      alignItems="center"
      justifyContent="center"
    >
      {Vec.map(availableColors, (color, index) => (
        <React.Fragment key={color}>
          <Avatar
            sx={{ bgcolor: theme.palette[color].main, width: 36, height: 36 }}
            onClick={() => onChange(color)}
          >
            {" " /* We use an avatar component for the colored background */}
          </Avatar>
        </React.Fragment>
      ))}
    </Stack>
  );
}

function PlayerSelector({
  playerIds,
  onChange,
}: {
  playerIds: readonly PlayerId[];
  onChange(playerId: PlayerId): void;
}): JSX.Element {
  if (playerIds.length < 4) {
    return <PlayerSelectorRow playerIds={playerIds} onChange={onChange} />;
  }

  const midPoint = Math.floor(playerIds.length / 2);

  return (
    <Stack direction="column" spacing={0.5}>
      <PlayerSelectorRow
        playerIds={Vec.take(playerIds, midPoint)}
        onChange={onChange}
      />
      <PlayerSelectorRow
        playerIds={Vec.drop(playerIds, midPoint)}
        onChange={onChange}
      />
    </Stack>
  );
}

function PlayerSelectorRow({
  playerIds,
  onChange,
}: {
  playerIds: readonly PlayerId[];
  onChange(playerId: PlayerId): void;
}): JSX.Element {
  return (
    <Stack
      direction="row"
      spacing={0.5}
      alignItems="center"
      justifyContent="center"
    >
      {React.Children.toArray(
        Vec.map(playerIds, (playerId) => (
          <PlayerAvatar
            sx={{ opacity: 0.5 }}
            size={AVATAR_SIZE}
            playerId={playerId}
            onClick={() => onChange(playerId)}
          />
        ))
      )}
    </Stack>
  );
}

function ConfigPanelTLDR({
  config,
}: {
  config: Readonly<TemplateConfig>;
}): JSX.Element {
  const playerIds = useAppSelector(
    playersSelectors.selectIds
  ) as readonly PlayerId[];

  const unassignedPlayers = useMemo(
    () => Vec.diff(playerIds, Vec.keys(config)),
    [config, playerIds]
  );

  if (Dict.is_empty(config)) {
    return <>Random</>;
  }

  return (
    <>
      <GrammaticalList>
        {React.Children.toArray(
          Vec.map_with_key(config, (playerId, color) => (
            <Chip
              component="span"
              size="small"
              color={color}
              label={<PlayerShortName playerId={playerId} />}
            />
          ))
        )}
      </GrammaticalList>
      {!Vec.is_empty(unassignedPlayers) && "; others assigned randomly"}
    </>
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

function InstanceManualComponent<ProductId>({
  availableColors,
  productsMetaStep,
}: {
  productsMetaStep: VariableGameStep<readonly ProductId[]>;
  availableColors(
    playerIds: readonly PlayerId[],
    products: readonly ProductId[]
  ): readonly GamePiecesColor[];
}): JSX.Element {
  const playerIds = useRequiredInstanceValue(playersMetaStep);
  const products = useRequiredInstanceValue(productsMetaStep);

  const colors = useMemo(
    () => availableColors(playerIds, products),
    [availableColors, playerIds, products]
  );

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

/**
 * Normalize the object we store both in the template and in the instance so
 * that the results are always canonical
 */
const normalize = (
  playerColors: Readonly<PlayerColors>,
  playerIds: readonly PlayerId[]
): Readonly<PlayerColors> =>
  Dict.sort_by_with_key(playerColors, (playerId) =>
    playerIds.indexOf(playerId)
  );
