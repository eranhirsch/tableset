import { Chip, styled, Typography } from "@mui/material";
import { Dict, Vec } from "common";
import { ConfigPanelProps } from "features/template/Templatable";
import { templateValue } from "features/template/templateSlice";
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
    fixed: mapsForProducts(products.resolve())[0],
  }),
  // Make sure we don't have a config which uses maps which aren't included
  // anymore
  refresh: () => templateValue("unchanged"),

  canResolveTo: (value, config, products) =>
    config != null &&
    mapsForProducts(products.resolve()).includes(value) &&
    ("random" in config || config.fixed === value),

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
  const selectedMapId =
    config != null && "fixed" in config ? config.fixed : null;
  return (
    <>
      {React.Children.toArray(
        Vec.map(mapsForProducts(products.resolve()), (mapId) => (
          <Chip
            color="primary"
            label={<RomanTitle>{MAPS[mapId].name}</RomanTitle>}
            variant={selectedMapId === mapId ? "filled" : "outlined"}
            size="small"
            onClick={
              selectedMapId !== mapId
                ? () => onChange({ fixed: mapId })
                : undefined
            }
          />
        ))
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

// function Selector({ current }: { current: MapId }): JSX.Element {
//   const productIds = useAppSelector(
//     allExpansionIdsSelector
//   ) as readonly ConcordiaProductId[];
//   return (
//     <GenericItemsListPanel
//       itemIds={mapsForProducts(productIds)}
//       selectedId={current}
//       onLabelForItem={(id) => MAPS[id].name}
//       // TODO: Fix this to use the proper action via ConfigPanel
//       onUpdateItem={(itemId) => templateActions.disabled("map")}
//     />
//   );
// }
