import { Grid, Typography } from "@mui/material";
import { Vec } from "common";
import { useRequiredInstanceValue } from "features/instance/useInstanceValue";
import {
  createVariableGameStep,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createVariableGameStep";
import React, { useMemo } from "react";
import GermaniaCastlesEncoder from "../utils/GermaniaCastlesEncoder";
import { RESOURCE_NAME } from "../utils/resource";
import RomanTitle from "../ux/RomanTitle";
import cityTilesStep from "./cityTilesStep";
import mapStep from "./mapStep";

export default createVariableGameStep({
  id: "germaniaRomanCastles",
  labelOverride: "Roman Castles (Germania Map Only!)",

  dependencies: [mapStep, cityTilesStep],

  InstanceVariableComponent,

  random: (mapId, hash) =>
    mapId === "germania"
      ? GermaniaCastlesEncoder.randomHash(mapId, hash)
      : null,
});

function InstanceVariableComponent({
  value,
}: VariableStepInstanceComponentProps<string>): JSX.Element {
  // TODO: Move this to dependencies
  const mapId = useRequiredInstanceValue(mapStep);
  const cityTilesHash = useRequiredInstanceValue(cityTilesStep);

  const resourceLocations = useMemo(
    () => GermaniaCastlesEncoder.decode(mapId, cityTilesHash, value),
    [cityTilesHash, mapId, value]
  );

  return (
    <>
      <Typography variant="body1">
        Place the matching bonus resource tiles, resource side up, on the Roman
        Castle place in the following locations:
      </Typography>
      <Grid container component="figure" spacing={1}>
        {React.Children.toArray(
          Vec.map_with_key(resourceLocations, (location, resource) => (
            <>
              <Grid item xs={4} textAlign="right">
                <Typography variant="subtitle1">
                  <RomanTitle>{location}</RomanTitle>
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="caption">
                  {RESOURCE_NAME[resource]}
                </Typography>
              </Grid>
            </>
          ))
        )}
      </Grid>
    </>
  );
}
