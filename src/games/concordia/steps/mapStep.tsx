import { styled, Typography } from "@mui/material";
import { useAppSelector } from "app/hooks";
import { Dict, Random, Shape, Vec } from "common";
import { allExpansionIdsSelector } from "features/expansions/expansionsSlice";
import { templateActions } from "features/template/templateSlice";
import createProductDependencyMetaStep from "games/core/steps/createProductDependencyMetaStep";
import GenericItemsFixedTemplateLabel from "games/core/ux/GenericItemsFixedTemplateLabel";
import GenericItemsListPanel from "games/core/ux/GenericItemsListPanel";
import React from "react";
import {
  createRandomGameStep,
  VariableStepInstanceComponentProps,
} from "../../core/steps/createRandomGameStep";
import { BlockWithFootnotes } from "../../core/ux/BlockWithFootnotes";
import GrammaticalList from "../../core/ux/GrammaticalList";
import { ConcordiaProductId } from "../concordiaGame";
import { MapId, MAPS } from "../utils/Maps";
import RomanTitle from "../ux/RomanTitle";

const MAPS_BY_PRODUCT = Object.freeze({
  base: ["imperium", "italia"],
  britanniaGermania: ["britannia", "germania"],
} as Record<ConcordiaProductId, readonly MapId[]>);

const allMaps = (productIds: readonly ConcordiaProductId[]): readonly MapId[] =>
  Vec.flatten(Vec.values(Shape.select_keys(MAPS_BY_PRODUCT, productIds)));

export default createRandomGameStep({
  id: "map",

  dependencies: [createProductDependencyMetaStep<ConcordiaProductId>()],

  isType: (x: string): x is MapId => x in MAPS,

  InstanceManualComponent,
  InstanceVariableComponent,

  random(productIds) {
    const availableMaps = allMaps(productIds);
    return availableMaps[Random.index(availableMaps)];
  },

  recommended: ({ playerIds }) =>
    playerIds.length <= 1
      ? undefined
      : playerIds.length <= 3
      ? "italia"
      : playerIds.length <= 5
      ? "imperium"
      : undefined,

  fixed: {
    initializer: (productIds) => allMaps(productIds)[0],

    renderTemplateLabel: TemplateLabel,
    renderSelector: Selector,
  },
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
      itemIds={allMaps(productIds)}
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
