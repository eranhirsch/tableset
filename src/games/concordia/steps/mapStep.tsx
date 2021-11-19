import { Button, Chip, Grid, styled, Typography } from "@mui/material";
import { C, Dict, MathUtils, nullthrows, Random, Vec } from "common";
import { useRequiredInstanceValue } from "features/instance/useInstanceValue";
import { templateValue } from "features/template/templateSlice";
import { playersMetaStep } from "games/global";
import { PlayerId } from "model/Player";
import React, { useCallback, useMemo } from "react";
import {
  ConfigPanelProps,
  createRandomGameStep,
  VariableStepInstanceComponentProps,
} from "../../core/steps/createRandomGameStep";
import { BlockWithFootnotes } from "../../core/ux/BlockWithFootnotes";
import { GrammaticalList } from "../../core/ux/GrammaticalList";
import { ConcordiaProductId } from "../ConcordiaProductId";
import { MapId, MAPS, mapsForProducts, productsWithMaps } from "../utils/MAPS";
import RomanTitle from "../ux/RomanTitle";
import productsMetaStep from "./productsMetaStep";

/**
 * This array defines the tightness scores (see MAPS definition) we pick from
 * for each player count. The player count is used as the index into the array,
 * that's why we have the Infinities at the start (so that the array type isn't
 * nullable)
 */
const TIGHTNESS_RATIO_BOUNDARIES = [
  Infinity,
  Infinity,
  // solo?
  Infinity,
  // 2 players
  1.9,
  // 3 players
  1.4,
  // 4 players
  1.1,
  // 5 players
  0.8,
  // 6 players
  0.0,
] as const;

type TemplateConfigDynamicMode = "any" | "recommended";
type TemplateConfig =
  | { static: readonly MapId[] }
  | { dynamic: TemplateConfigDynamicMode };

export default createRandomGameStep({
  id: "map",

  dependencies: [productsMetaStep, playersMetaStep],

  isType: (x: string): x is MapId => x in MAPS,

  InstanceManualComponent,
  InstanceVariableComponent,

  isTemplatable: (products) => products.willContainAny(productsWithMaps()),

  resolve: (config, products, players) =>
    Random.sample(relevantMapsForConfig(config, products!, players!), 1),

  onlyResolvableValue: (config, products, players) =>
    config != null
      ? C.only(
          relevantMapsForConfig(
            config,
            products.onlyResolvableValue()!,
            players.onlyResolvableValue()!
          )
        )
      : undefined,

  initialConfig: (): TemplateConfig => ({ dynamic: "recommended" }),

  refresh: (config, products) =>
    "static" in config
      ? {
          static: Vec.intersect(
            config.static,
            mapsForProducts(products.onlyResolvableValue()!)
          ),
        }
      : templateValue("unchanged"),

  canResolveTo: (value, config, products, players) =>
    config != null &&
    relevantMapsForConfig(
      config,
      products.onlyResolvableValue()!,
      players.onlyResolvableValue()!
    ).includes(value),

  ConfigPanel,
  ConfigPanelTLDR,
});

function ConfigPanel({
  config,
  queries: [productsQuery, playersQuery],
  onChange,
}: ConfigPanelProps<
  TemplateConfig,
  readonly ConcordiaProductId[],
  readonly PlayerId[]
>): JSX.Element {
  const products = productsQuery.onlyResolvableValue()!;
  const players = playersQuery.onlyResolvableValue()!;

  const relevantMapIds = useMemo(
    // Keep the map IDs sorted in the stored array so that the results are
    // always normalized and canonical
    () => Vec.sort(relevantMapsForConfig(config, products, players)),
    [config, players, products]
  );

  const dynamicOnClick = useCallback(
    (mode: TemplateConfigDynamicMode | "static") =>
      onChange(
        mode === "static" ? { static: relevantMapIds } : { dynamic: mode }
      ),
    [onChange, relevantMapIds]
  );

  const staticOnClick = useCallback(
    (mapId) =>
      onChange({
        static: relevantMapIds.includes(mapId)
          ? Vec.filter(relevantMapIds, (x) => x !== mapId)
          : // Keep the map IDs sorted in the stored array so that the results
            // are always normalized and canonical
            Vec.sort(Vec.concat(relevantMapIds, mapId)),
      }),
    [onChange, relevantMapIds]
  );

  const onClear = useCallback(() => onChange({ static: [] }), [onChange]);

  return (
    <Grid container>
      <StaticChips
        config={config}
        products={products}
        players={players}
        onClick={staticOnClick}
        onClear={onClear}
      />
      <DynamicChips
        config={config}
        products={products}
        players={players}
        onClick={dynamicOnClick}
      />
    </Grid>
  );
}

function StaticChips({
  config,
  products,
  players,
  onClick,
  onClear,
}: {
  config: Readonly<TemplateConfig>;
  products: readonly ConcordiaProductId[];
  players: readonly PlayerId[];
  onClick(clickedMapId: MapId): void;
  onClear(): void;
}): JSX.Element {
  const allMapIds = useMemo(() => mapsForProducts(products), [products]);

  const relevantMapIds = useMemo(
    () => relevantMapsForConfig(config, products, players),
    [config, players, products]
  );

  return (
    <Grid
      item
      xs={7}
      alignSelf="center"
      textAlign="center"
      display="flex"
      flexWrap="wrap"
      justifyContent="space-evenly"
      gap={0.5}
    >
      {React.Children.toArray(
        Vec.map(
          // Sort the maps by tightness with tight maps first
          Vec.sort_by(allMapIds, (mapId) => -MAPS[mapId].tightnessScore),
          (mapId) => (
            <Chip
              disabled={"dynamic" in config}
              label={<RomanTitle>{MAPS[mapId].name}</RomanTitle>}
              color={relevantMapIds.length === 0 ? "error" : "primary"}
              variant={relevantMapIds.includes(mapId) ? "filled" : "outlined"}
              size="small"
              sx={{
                marginX: relevantMapIds.includes(mapId) ? "1px" : undefined,
              }}
              onClick={() => onClick(mapId)}
            />
          )
        )
      )}
      {"static" in config && (
        <Button
          disabled={"dynamic" in config || relevantMapIds.length === 0}
          size="small"
          variant="text"
          sx={{ paddingX: 8 }}
          onClick={() => onClear()}
        >
          Clear
        </Button>
      )}
    </Grid>
  );
}

function DynamicChips({
  config,
  products,
  players,
  onClick,
}: {
  config: Readonly<TemplateConfig>;
  products: readonly ConcordiaProductId[];
  players: readonly PlayerId[];
  onClick(mode: TemplateConfigDynamicMode | "static"): void;
}): JSX.Element {
  const allMapIds = useMemo(() => mapsForProducts(products), [products]);

  const recommendedMapIds = useMemo(
    () => recommendedForPlayerCount(players.length, allMapIds),
    [allMapIds, players]
  );

  return (
    <Grid item xs={5} padding={0.5} alignSelf="center" textAlign="center">
      <DynamicChip
        config={config}
        mode="any"
        label="Any"
        equivalentStaticSet={allMapIds}
        onClick={() => onClick("any")}
      />
      <DynamicChip
        config={config}
        mode="recommended"
        label="Recommended"
        equivalentStaticSet={recommendedMapIds}
        onClick={() => onClick("recommended")}
      />
      <Chip
        label="<<< Static"
        color={"dynamic" in config ? "primary" : "default"}
        variant={"static" in config ? "filled" : "outlined"}
        sx={{ width: "100%", marginY: 0.5 }}
        disabled={"static" in config}
        onClick={() => onClick("static")}
      />
    </Grid>
  );
}

function DynamicChip({
  config,
  mode,
  equivalentStaticSet,
  onClick,
  label,
}: {
  config: Readonly<TemplateConfig>;
  mode: TemplateConfigDynamicMode;
  equivalentStaticSet: readonly MapId[];
  onClick(): void;
  label: string;
}): JSX.Element {
  return (
    <Chip
      label={label}
      color={"dynamic" in config ? "primary" : "default"}
      variant={
        ("dynamic" in config && config.dynamic === mode) ||
        ("static" in config &&
          Vec.equal_multiset(config.static, equivalentStaticSet))
          ? "filled"
          : "outlined"
      }
      sx={{ width: "100%", marginY: 0.5 }}
      onClick={onClick}
    />
  );
}

function ConfigPanelTLDR({
  config,
}: {
  config: Readonly<TemplateConfig>;
}): JSX.Element {
  if ("static" in config) {
    if (config.static.length === 0) {
      return <>None</>;
    }

    if (config.static.length <= 3) {
      return (
        <GrammaticalList finalConjunction="or">
          {Vec.map_with_key(
            Dict.select_keys(MAPS, config.static),
            (_, { name }) => (
              <RomanTitle>{name}</RomanTitle>
            )
          )}
        </GrammaticalList>
      );
    }

    const sample = Random.sample(config.static, 2);
    return (
      <>
        {MAPS[sample[0]].name}, {MAPS[sample[1]].name}, and{" "}
        {config.static.length - 2} other maps
      </>
    );
  }

  const { dynamic } = config;
  switch (dynamic) {
    case "any":
      return <>Any available map</>;
    case "recommended":
      return <>A suitable map for the current player count.</>;
  }
}

const ChosenMapName = styled(RomanTitle)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: "150%",
}));

function InstanceVariableComponent({
  value: mapId,
}: VariableStepInstanceComponentProps<MapId>): JSX.Element {
  return (
    <Typography variant="body1">
      Place the board with the <ChosenMapName>{MAPS[mapId].name}</ChosenMapName>{" "}
      map at the center of the table.
    </Typography>
  );
}

function InstanceManualComponent() {
  // TODO: Have this data passed through the API and not have the component
  // fetch it itself.
  const products = useRequiredInstanceValue(productsMetaStep);
  return (
    <BlockWithFootnotes
      footnote={
        <>
          Available maps (a higher tightness score means fewer cities and fewer
          provinces; this increases player interaction making them more suited
          for lower player counts):{" "}
          <GrammaticalList>
            {Vec.map_with_key(
              Dict.sort_by(
                Dict.select_keys(MAPS, mapsForProducts(products)),
                // Put tighter maps first
                ({ tightnessScore }) => -tightnessScore
              ),
              (mapId, { name, tightnessScore }) => (
                <React.Fragment key={mapId}>
                  <RomanTitle>{name}</RomanTitle> ({tightnessScore})
                </React.Fragment>
              )
            )}
          </GrammaticalList>
        </>
      }
    >
      {(Footnote) => (
        <Typography variant="body1">
          Pick a map board
          <Footnote /> and place it at the center of the table.
        </Typography>
      )}
    </BlockWithFootnotes>
  );
}

function relevantMapsForConfig(
  config: TemplateConfig,
  products: readonly ConcordiaProductId[],
  players: readonly PlayerId[]
): readonly MapId[] {
  if ("static" in config) {
    return config.static;
  }

  const availableMapIds = mapsForProducts(products);

  switch (config.dynamic) {
    case "any":
      return availableMapIds;

    case "recommended":
      return recommendedForPlayerCount(players.length, availableMapIds);
  }
}

function recommendedForPlayerCount(
  playerCount: number,
  availableMapIds: readonly MapId[]
): readonly MapId[] {
  if (playerCount < 2 || playerCount > 6) {
    // No recommended maps for player counts the game wasn't designed for
    return [];
  }

  const [max, min] = TIGHTNESS_RATIO_BOUNDARIES.slice(
    playerCount,
    playerCount + 2
  );

  const mapIds = Vec.filter(
    availableMapIds,
    (mapId) =>
      MAPS[mapId].tightnessScore <= max && MAPS[mapId].tightnessScore >= min
  );

  if (!Vec.is_empty(mapIds)) {
    return mapIds;
  }

  // The range was empty, we can look for the map which was closest to the range
  // from either side.
  const closest = MathUtils.min_by(availableMapIds, (mapId) =>
    Math.min(
      ...Vec.map([max, min], (x) => Math.abs(MAPS[mapId].tightnessScore - x))
    )
  );
  return [
    nullthrows(
      closest,
      `Couldn't find closest value, availableMapsIds was probably empty: ${JSON.stringify(
        availableMapIds
      )}`
    ),
  ];
}
