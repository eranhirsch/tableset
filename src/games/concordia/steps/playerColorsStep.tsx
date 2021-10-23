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
import { Dict, Vec } from "common";
import { useRequiredInstanceValue } from "features/instance/useInstanceValue";
import { PlayerShortName } from "features/players/PlayerShortName";
import { playersSelectors } from "features/players/playersSlice";
import { ConfigPanelProps } from "features/template/Templatable";
import { templateValue } from "features/template/templateSlice";
import { playersMetaStep } from "games/core/steps/createPlayersDependencyMetaStep";
import { GamePiecesColor } from "model/GamePiecesColor";
import { PlayerId } from "model/Player";
import React, { useMemo, useRef } from "react";
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

const AVATAR_SIZE = 36;

type TemplateConfig = Record<PlayerId, GamePiecesColor>;

// This is the instance type, it's identical to the TemplateConfig, but it
// doesn't HAVE to be, so don't merge the two type definitions.
type PlayerColors = Readonly<Record<PlayerId, GamePiecesColor>>;

export default createRandomGameStep({
  id: "colors",

  dependencies: [playersMetaStep, productsMetaStep],

  InstanceVariableComponent,
  InstanceManualComponent,

  isTemplatable: (players, products) =>
    players.count({ max: availableColors(products.resolve()).length }),

  resolve: (config, playerIds, products): PlayerColors => ({
    ...config,
    // Associate a color for each remaining player
    ...Dict.associate(
      // Players without an assigned color
      Vec.diff(playerIds!, Vec.keys(config)),
      // Shuffle the colors which aren't already used
      Vec.shuffle(Vec.diff(availableColors(products!), Vec.values(config)))
    ),
  }),

  initialConfig: (): TemplateConfig => ({}),

  refresh: (current, players) => {
    // Create a new dict with only the current players in it, effectively
    // removing all assignments for players that don't exist anymore.
    const refreshed = Dict.select_keys(current, players.resolve());
    return Dict.size(refreshed) < Dict.size(current)
      ? // Only return a new value if it's different
        refreshed
      : templateValue("unchanged");
  },

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
  const assignedPlayers = useMemo(() => Vec.keys(config ?? {}), [config]);

  const order = useRef<readonly PlayerId[]>([]);
  order.current = Vec.concat(
    Vec.intersect(order.current, assignedPlayers),
    Vec.diff(assignedPlayers, order.current)
  );
  const sorted = useMemo(
    () =>
      // We memoize a sorted version of the config to stop the rows from jumping
      // around with the changes.
      Dict.sort_by_with_key(config ?? {}, (playerId) =>
        order.current.indexOf(playerId)
      ),
    [config]
  );

  const playerIds = players.resolve();
  const remainingPlayerIds = useMemo(
    () => (config == null ? playerIds : Vec.diff(playerIds, assignedPlayers)),
    [assignedPlayers, config, playerIds]
  );
  const remainingColors = useMemo(() => {
    const allColors = availableColors(products.resolve());
    return config == null ? allColors : Vec.diff(allColors, Vec.values(config));
  }, [config, products]);

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
                    Dict.filter_with_keys(
                      current ?? {},
                      (pid) => pid !== playerId
                    ),
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
                current == null
                  ? {}
                  : Dict.filter_with_keys(current, (pid) => pid !== playerId)
              )
            }
          />
        </React.Fragment>
      ))}

      {Dict.size(sorted) < players.resolve().length && (
        // New row button
        <Grid item xs={12} alignSelf="center" textAlign="center">
          <Button
            onClick={() =>
              onChange((current) => ({
                ...(current ?? {}),
                [Vec.sample(remainingPlayerIds, 1)]: Vec.sample(
                  remainingColors,
                  1
                ),
              }))
            }
          >
            + Add Fixed Color
          </Button>
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
        availableColors={Vec.take(availableColors, midPoint - 1)}
        onChange={onChange}
      />
      <ColorSelectorRow
        availableColors={availableColors.slice(midPoint)}
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
        playerIds={Vec.take(playerIds, midPoint - 1)}
        onChange={onChange}
      />
      <PlayerSelectorRow
        playerIds={playerIds.slice(midPoint)}
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

const availableColors = (
  products: readonly ConcordiaProductId[]
): readonly GamePiecesColor[] =>
  Vec.concat(
    BASE_COLORS,
    products.includes("venus") || products.includes("venusBase")
      ? VENUS_COLORS
      : []
  );
