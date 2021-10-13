import { Chip, Grid, styled, Typography } from "@mui/material";
import { Dict, Vec } from "common";
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

type TemplateConfig =
  | { static: readonly MapId[] }
  | { dynamic: "any" | "recommended" };

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
  return [];
}

function ConfigPanel({
  config,
  queries: [products, players],
  onChange,
}: ConfigPanelProps<
  TemplateConfig,
  readonly ConcordiaProductId[],
  readonly PlayerId[]
>): JSX.Element {
  const allMapIds = useMemo(
    () => mapsForProducts(products.resolve()),
    [products]
  );
  const recommendedMapIds = useMemo(
    () => recommendedForPlayerCount(players.resolve().length, allMapIds),
    [allMapIds, players]
  );
  const relevantMapIds = useMemo(
    () =>
      config == null
        ? []
        : relevantMapsForConfig(config, products.resolve(), players.resolve()),
    [config, players, products]
  );
  return (
    <Grid container xs paddingX={3} paddingY={1}>
      <Grid
        item
        xs={9}
        alignSelf="center"
        textAlign="center"
        padding={1}
        sx={{ opacity: config == null || "random" in config ? 0.5 : 1.0 }}
      >
        {React.Children.toArray(
          Vec.map(
            // Sort the maps by tightness with tight maps first
            Vec.sort_by(allMapIds, (mapId) => -MAPS[mapId].tightnessScore),
            (mapId) => (
              <Chip
                label={<RomanTitle>{MAPS[mapId].name}</RomanTitle>}
                color={
                  config != null && "static" in config ? "primary" : "default"
                }
                variant={relevantMapIds.includes(mapId) ? "filled" : "outlined"}
                size="small"
                sx={{ margin: 0.25 }}
                onClick={() => {
                  onChange({
                    static: relevantMapIds.includes(mapId)
                      ? Vec.filter(relevantMapIds, (x) => x !== mapId)
                      : Vec.concat(relevantMapIds, mapId),
                  });
                }}
              />
            )
          )
        )}
      </Grid>
      <Grid item xs={3} padding={1} alignSelf="center" textAlign="center">
        <Chip
          label="Any"
          color={config != null && "dynamic" in config ? "primary" : "default"}
          variant={
            config != null &&
            (("dynamic" in config && config.dynamic === "any") ||
              ("static" in config && config.static.length === allMapIds.length))
              ? "filled"
              : "outlined"
          }
          onClick={() =>
            onChange(
              config != null && "dynamic" in config && config.dynamic === "any"
                ? { static: allMapIds }
                : { dynamic: "any" }
            )
          }
        />
        <Chip
          label="Recommended"
          color={config != null && "dynamic" in config ? "primary" : "default"}
          variant={
            config != null &&
            (("dynamic" in config && config.dynamic === "recommended") ||
              ("static" in config &&
                Vec.equal_multiset(recommendedMapIds, config.static)))
              ? "filled"
              : "outlined"
          }
          onClick={() =>
            onChange(
              config != null &&
                "dynamic" in config &&
                config.dynamic === "recommended"
                ? { static: recommendedMapIds }
                : { dynamic: "recommended" }
            )
          }
        />
      </Grid>
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
