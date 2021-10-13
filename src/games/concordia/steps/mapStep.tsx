import { Chip, Grid, styled, Typography } from "@mui/material";
import { Dict, MathUtils, nullthrows, Vec } from "common";
import { ConfigPanelProps } from "features/template/Templatable";
import { templateValue } from "features/template/templateSlice";
import { playersMetaStep } from "games/core/steps/createPlayersDependencyMetaStep";
import { PlayerId } from "model/Player";
import React, { useMemo } from "react";
import {
  createRandomGameStep,
  VariableStepInstanceComponentProps,
} from "../../core/steps/createRandomGameStep";
import { BlockWithFootnotes } from "../../core/ux/BlockWithFootnotes";
import { GrammaticalList } from "../../core/ux/GrammaticalList";
import { MapId, MAPS, mapsForProducts, productsWithMaps } from "../utils/Maps";
import RomanTitle from "../ux/RomanTitle";
import { ConcordiaProductId, productsMetaStep } from "./productsMetaStep";

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
  1.7,
  // 3 players
  1.3,
  // 4 players
  0.85,
  // 5 players
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
    Vec.sample(relevantMapsForConfig(config, products!, players!), 1),

  initialConfig: (): TemplateConfig => ({ dynamic: "any" }),

  refresh: (config, products) =>
    "static" in config
      ? {
          static: Vec.intersect(
            config.static,
            mapsForProducts(products.resolve())
          ),
        }
      : templateValue("unchanged"),

  canResolveTo: (value, config, products, players) =>
    config != null &&
    relevantMapsForConfig(
      config,
      products.resolve(),
      players.resolve()
    ).includes(value),

  ConfigPanel,
});

function ConfigPanel({
  config,
  queries: [productsQuery, playersQuery],
  onChange,
}: ConfigPanelProps<
  TemplateConfig,
  readonly ConcordiaProductId[],
  readonly PlayerId[]
>): JSX.Element | null {
  const products = productsQuery.resolve();
  const players = playersQuery.resolve();

  const relevantMapIds = useMemo(
    () =>
      config == null ? [] : relevantMapsForConfig(config, products, players),
    [config, players, products]
  );

  if (config == null) {
    return null;
  }

  return (
    <Grid container paddingX={3} paddingY={0.5}>
      <StaticChips
        config={config}
        products={products}
        players={players}
        onClick={(mapId) =>
          onChange({
            static: relevantMapIds.includes(mapId)
              ? Vec.filter(relevantMapIds, (x) => x !== mapId)
              : Vec.concat(relevantMapIds, mapId),
          })
        }
      />
      <DynamicChips
        config={config}
        products={products}
        players={players}
        onClick={(mode) =>
          onChange(
            "dynamic" in config && config.dynamic === mode
              ? { static: relevantMapIds }
              : { dynamic: mode }
          )
        }
      />
    </Grid>
  );
}

function StaticChips({
  config,
  products,
  players,
  onClick,
}: {
  config: TemplateConfig;
  products: readonly ConcordiaProductId[];
  players: readonly PlayerId[];
  onClick(clickedMapId: MapId): void;
}): JSX.Element {
  const allMapIds = useMemo(() => mapsForProducts(products), [products]);
  const relevantMapIds = useMemo(
    () => relevantMapsForConfig(config, products, players),
    [config, players, products]
  );

  return (
    <Grid item xs={7} alignSelf="center" textAlign="center" padding={0.5}>
      {React.Children.toArray(
        Vec.map(
          // Sort the maps by tightness with tight maps first
          Vec.sort_by(allMapIds, (mapId) => -MAPS[mapId].tightnessScore),
          (mapId) => (
            <Chip
              label={<RomanTitle>{MAPS[mapId].name}</RomanTitle>}
              color={"static" in config ? "primary" : "default"}
              variant={relevantMapIds.includes(mapId) ? "filled" : "outlined"}
              size="small"
              sx={{ margin: 0.25 }}
              onClick={() => onClick(mapId)}
            />
          )
        )
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
  config: TemplateConfig;
  products: readonly ConcordiaProductId[];
  players: readonly PlayerId[];
  onClick(mode: TemplateConfigDynamicMode): void;
}): JSX.Element {
  const allMapIds = useMemo(() => mapsForProducts(products), [products]);
  const recommendedMapIds = useMemo(
    () => recommendedForPlayerCount(players.length, allMapIds),
    [allMapIds, players]
  );

  return (
    <Grid item xs={5} padding={0.5} alignSelf="center" textAlign="center">
      <Chip
        label="Any"
        color={"dynamic" in config ? "primary" : "default"}
        variant={
          ("dynamic" in config && config.dynamic === "any") ||
          ("static" in config && config.static.length === allMapIds.length)
            ? "filled"
            : "outlined"
        }
        sx={{ width: "100%", marginY: 0.5 }}
        onClick={() => onClick("any")}
      />
      <Chip
        label="Recommended"
        color={"dynamic" in config ? "primary" : "default"}
        variant={
          ("dynamic" in config && config.dynamic === "recommended") ||
          ("static" in config &&
            Vec.equal_multiset(recommendedMapIds, config.static))
            ? "filled"
            : "outlined"
        }
        sx={{ width: "100%", marginY: 0.5 }}
        onClick={() => onClick("recommended")}
      />
    </Grid>
  );
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
  return (
    <BlockWithFootnotes
      footnotes={[
        <>
          Available maps (a higher tightness score means fewer cities and fewer
          provinces; this increases player interaction making them more suited
          for lower player counts):{" "}
          <GrammaticalList>
            {Vec.map_with_key(
              // Put tighter maps first
              Dict.sort_by(MAPS, ({ tightnessScore }) => -tightnessScore),
              (mapId, { name, tightnessScore }) => (
                <React.Fragment key={mapId}>
                  <RomanTitle>{name}</RomanTitle> ({tightnessScore})
                </React.Fragment>
              )
            )}
          </GrammaticalList>
        </>,
      ]}
    >
      {(Footnote) => (
        <Typography variant="body1">
          Pick a map board
          <Footnote index={1} /> and place it at the center of the table.
        </Typography>
      )}
    </BlockWithFootnotes>
  );
}

// function TemplateLabel({ value }: { value: MapId }): JSX.Element {
//   return (
//     <GenericItemsFixedTemplateLabel
//       onLabelForItem={(id) => MAPS[id].name}
//       selectedId={value}
//     />
//   );
// }

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
  if (playerCount < 2 || playerCount > 5) {
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
