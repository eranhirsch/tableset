import { styled, Typography } from "@material-ui/core";
import createGenericItemsGameStep from "../../core/steps/createGenericItemsGameStep";
import { VariableStepInstanceComponentProps } from "../../core/steps/createVariableGameStep";
import { MAPS, MapId } from "../utils/Maps";

const MapName = styled("strong")(({ theme }) => ({
  color: theme.palette.primary.main,
  fontVariantCaps: "petite-caps",
  fontSize: "150%",
}));

function InstanceVariableComponent({
  value: mapId,
}: VariableStepInstanceComponentProps<MapId>): JSX.Element {
  return (
    <Typography variant="body2">
      Place the board with the <MapName>{MAPS[mapId].name}</MapName> map at the
      center of the table.
    </Typography>
  );
}

export default createGenericItemsGameStep({
  id: "map",
  itemIds: Object.keys(MAPS) as MapId[],

  labelFor: (id: MapId) => MAPS[id].name,
  InstanceVariableComponent,

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
