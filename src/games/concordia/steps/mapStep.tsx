import {
  Checkbox,
  Chip,
  FormControlLabel,
  Grid,
  styled,
  Typography,
} from "@mui/material";
import { Dict, Vec } from "common";
import { ConfigPanelProps } from "features/template/Templatable";
import { templateValue } from "features/template/templateSlice";
import { Query } from "games/core/steps/Query";
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

type TemplateConfig = { random: true } | { fixed: MapId };

export default createRandomGameStep({
  id: "map",

  dependencies: [productsMetaStep],

  isType: (x: string): x is MapId => x in MAPS,

  InstanceManualComponent,
  InstanceVariableComponent,

  isTemplatable: (products) => products.willContainAny(productsWithMaps()),

  resolve: (config, productIds) =>
    "fixed" in config
      ? config.fixed
      : Vec.sample(mapsForProducts(productIds!), 1),

  initialConfig: (products) => ({
    fixed: defaultMap(products),
  }),

  refresh: (config, products) =>
    templateValue(
      "random" in config ||
        mapsForProducts(products.resolve()).includes(config.fixed)
        ? "unchanged"
        : "unfixable"
    ),

  canResolveTo: (value, config, products) =>
    config != null &&
    mapsForProducts(products.resolve()).includes(value) &&
    ("random" in config || config.fixed === value),

  ConfigPanel,
});

const defaultMap = (products: Query<readonly ConcordiaProductId[]>): MapId =>
  mapsForProducts(products.resolve())[0];

function ConfigPanel({
  config,
  queries: [products],
  onChange,
}: ConfigPanelProps<
  TemplateConfig,
  readonly ConcordiaProductId[]
>): JSX.Element {
  const initialFixed = useMemo(() => defaultMap(products), [products]);
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
        <FixedSelector
          mapIds={mapsForProducts(products.resolve())}
          currentMapId={
            config == null || "random" in config ? null : config.fixed
          }
          onChange={(mapId) => onChange({ fixed: mapId })}
          disabled={config == null || "random" in config}
        />
      </Grid>
      <Grid item xs={3} padding={1} alignSelf="center">
        <FormControlLabel
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
      </Grid>
    </Grid>
  );
}

function FixedSelector({
  mapIds,
  currentMapId,
  onChange,
  disabled,
}: {
  mapIds: readonly MapId[];
  currentMapId: MapId | null;
  onChange(newMapId: MapId): void;
  disabled: boolean;
}): JSX.Element {
  return (
    <>
      {React.Children.toArray(
        Vec.map(
          // Sort the maps by tightness with tight maps first
          Vec.sort_by(mapIds, (mapId) => -MAPS[mapId].tightnessScore),
          (mapId) => (
            <Chip
              sx={{ margin: "8px" }}
              color="primary"
              label={<RomanTitle>{MAPS[mapId].name}</RomanTitle>}
              variant={currentMapId === mapId ? "filled" : "outlined"}
              size="small"
              onClick={
                !disabled && currentMapId !== mapId
                  ? () => onChange(mapId)
                  : undefined
              }
            />
          )
        )
      )}
    </>
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
