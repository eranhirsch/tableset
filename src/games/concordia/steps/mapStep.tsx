import { styled, Typography } from "@material-ui/core";
import React from "react";
import array_sort_by from "../../../common/lib_utils/array_sort_by";
import createGenericItemsGameStep from "../../core/steps/createGenericItemsGameStep";
import { VariableStepInstanceComponentProps } from "../../core/steps/createVariableGameStep";
import { BlockWithFootnotes } from "../../core/ux/BlockWithFootnotes";
import GrammaticalList from "../../core/ux/GrammaticalList";
import { MAPS, MapId } from "../utils/Maps";

const MapName = styled("span")({
  fontVariantCaps: "petite-caps",
});

const ChosenMapName = styled("strong")(({ theme }) => ({
  color: theme.palette.primary.main,
  fontVariantCaps: "petite-caps",
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
          Available maps (maps with a higher tightness score have fewer cities
          and fewer provinces, this increases player interaction making them
          more suited for lower player counts):{" "}
          <GrammaticalList>
            {array_sort_by(
              Object.entries(MAPS),
              // Put tighterr maps first
              ([, map]) => -map.tightnessScore
            ).map(([mapId, map]) => (
              <React.Fragment key={mapId}>
                <MapName>{map.name}</MapName> ({map.tightnessScore})
              </React.Fragment>
            ))}
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

export default createGenericItemsGameStep({
  id: "map",
  itemIds: Object.keys(MAPS) as MapId[],

  labelFor: (id: MapId) => MAPS[id].name,
  InstanceVariableComponent,
  InstanceManualComponent,

  isType: (x: string): x is MapId => MAPS[x as MapId] != null,
  recommended: ({ playerIds }) =>
    playerIds.length <= 1
      ? undefined
      : playerIds.length <= 3
      ? "italia"
      : playerIds.length <= 5
      ? "imperium"
      : undefined,
});
