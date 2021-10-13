import { Chip, Grid, styled, Typography } from "@mui/material";
import { Dict, Vec } from "common";
import { ConfigPanelProps } from "features/template/Templatable";
import React from "react";
import {
  createRandomGameStep,
  VariableStepInstanceComponentProps,
} from "../../core/steps/createRandomGameStep";
import { BlockWithFootnotes } from "../../core/ux/BlockWithFootnotes";
import { GrammaticalList } from "../../core/ux/GrammaticalList";
import { MapId, MAPS, mapsForProducts, productsWithMaps } from "../utils/Maps";
import RomanTitle from "../ux/RomanTitle";
import { ConcordiaProductId, productsMetaStep } from "./productsMetaStep";

type TemplateConfig = { mapIds: readonly MapId[] };

export default createRandomGameStep({
  id: "map",

  dependencies: [productsMetaStep],

  isType: (x: string): x is MapId => x in MAPS,

  InstanceManualComponent,
  InstanceVariableComponent,

  isTemplatable: (products) => products.willContainAny(productsWithMaps()),

  resolve: (config) => Vec.sample(config.mapIds, 1),

  initialConfig: (products) => ({
    mapIds: mapsForProducts(products.resolve()),
  }),

  refresh: (config, products) => ({
    mapIds: Vec.intersect(config.mapIds, mapsForProducts(products.resolve())),
  }),

  canResolveTo: (value, config) =>
    config != null && config.mapIds.includes(value),

  ConfigPanel,
});

function ConfigPanel({
  config,
  queries: [products],
  onChange,
}: ConfigPanelProps<
  TemplateConfig,
  readonly ConcordiaProductId[]
>): JSX.Element {
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
            Vec.sort_by(
              mapsForProducts(products.resolve()),
              // Sort the maps by tightness with tight maps first
              (mapId) => -MAPS[mapId].tightnessScore
            ),
            (mapId) => (
              <Chip
                sx={{ margin: 0.25 }}
                color="primary"
                label={<RomanTitle>{MAPS[mapId].name}</RomanTitle>}
                variant={
                  config?.mapIds?.includes(mapId) ? "filled" : "outlined"
                }
                size="small"
                onClick={() =>
                  onChange({
                    mapIds:
                      config == null
                        ? [mapId]
                        : config.mapIds.includes(mapId)
                        ? Vec.filter(config.mapIds, (x) => x !== mapId)
                        : Vec.concat(config.mapIds, mapId),
                  })
                }
              />
            )
          )
        )}
      </Grid>
      <Grid item xs={3} padding={1} alignSelf="center" textAlign="center">
        <Chip
          label="All"
          onClick={() =>
            onChange({ mapIds: mapsForProducts(products.resolve()) })
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
