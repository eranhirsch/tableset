import { Typography } from "@material-ui/core";
import { VariableStepInstanceComponentProps } from "../../core/steps/createVariableGameStep";
import { MapId, MAPS } from "../steps/mapStep";

export default function ConcordiaMap({
  value: mapId,
}: VariableStepInstanceComponentProps<MapId>): JSX.Element {
  return (
    <Typography variant="h4" sx={{ fontVariantCaps: "petite-caps" }}>
      {MAPS[mapId].name}
    </Typography>
  );
}
