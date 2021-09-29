import { styled, Typography } from "@mui/material";
import { Dict, Vec } from "common";
import React from "react";
import createGenericItemsGameStep from "../../core/steps/createGenericItemsGameStep";
import { VariableStepInstanceComponentProps } from "../../core/steps/createVariableGameStep";
import { BlockWithFootnotes } from "../../core/ux/BlockWithFootnotes";
import GrammaticalList from "../../core/ux/GrammaticalList";
import { MapId, MAPS } from "../utils/Maps";
import RomanTitle from "../ux/RomanTitle";

export default createGenericItemsGameStep({
  id: "map",
  itemIds: Vec.keys(MAPS),

  labelFor: (id: MapId) => MAPS[id].name,
  InstanceVariableComponent,
  InstanceManualComponent,

  isType: (x: string): x is MapId => x in MAPS,
  recommended: ({ playerIds }) =>
    playerIds.length <= 1
      ? undefined
      : playerIds.length <= 3
      ? "italia"
      : playerIds.length <= 5
      ? "imperium"
      : undefined,
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
              Dict.sort_by(MAPS, (map) => -map.tightnessScore),
              (mapId, map) => (
                <React.Fragment key={mapId}>
                  <RomanTitle>{map.name}</RomanTitle> ({map.tightnessScore})
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
