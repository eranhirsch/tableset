import { styled, Typography } from "@mui/material";
import { useAppSelector } from "app/hooks";
import { Dict, Random, Vec } from "common";
import { allExpansionIdsSelector } from "features/expansions/expansionsSlice";
import {
  templateActions,
  templateValue,
} from "features/template/templateSlice";
import GenericItemsFixedTemplateLabel from "games/core/ux/GenericItemsFixedTemplateLabel";
import GenericItemsListPanel from "games/core/ux/GenericItemsListPanel";
import React from "react";
import {
  createRandomGameStep,
  VariableStepInstanceComponentProps,
} from "../../core/steps/createRandomGameStep";
import { BlockWithFootnotes } from "../../core/ux/BlockWithFootnotes";
import GrammaticalList from "../../core/ux/GrammaticalList";
import { MapId, MAPS, mapsForProducts, productsWithMaps } from "../utils/Maps";
import RomanTitle from "../ux/RomanTitle";
import { ConcordiaProductId, productsMetaStep } from "./productsMetaStep";

export default createRandomGameStep({
  id: "map",

  dependencies: [productsMetaStep],

  isType: (x: string): x is MapId => x in MAPS,

  InstanceManualComponent,
  InstanceVariableComponent,

  random(productIds) {
    const availableMaps = mapsForProducts(productIds);
    return availableMaps[Random.index(availableMaps)];
  },

  fixed: {
    initializer: (productIds) => mapsForProducts(productIds)[0],

    renderTemplateLabel: TemplateLabel,
    renderSelector: Selector,
  },

  isTemplatable: (products) => products.willContainAny(productsWithMaps()),
  refresh: () => templateValue("unchanged"),
});

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

function TemplateLabel({ value }: { value: MapId }): JSX.Element {
  return (
    <GenericItemsFixedTemplateLabel
      onLabelForItem={(id) => MAPS[id].name}
      selectedId={value}
    />
  );
}

function Selector({ current }: { current: MapId }): JSX.Element {
  const productIds = useAppSelector(
    allExpansionIdsSelector
  ) as readonly ConcordiaProductId[];
  return (
    <GenericItemsListPanel
      itemIds={mapsForProducts(productIds)}
      selectedId={current}
      onLabelForItem={(id) => MAPS[id].name}
      onUpdateItem={(itemId) =>
        templateActions.constantValueChanged({
          id: "map",
          value: itemId,
        })
      }
    />
  );
}
