import { Grid, Typography } from "@material-ui/core";
import React from "react";
import { useMemo } from "react";
import invariant_violation from "../../../common/err/invariant_violation";
import { useAppEntityIdSelectorEnforce } from "../../../common/hooks/useAppEntityIdSelector";
import { instanceSelectors } from "../../../features/instance/instanceSlice";
import { VariableStepInstanceComponentProps } from "../../core/steps/createVariableGameStep";
import CityResourcesEncoder from "../utils/CityResourcesEncoder";

export default function CityTilesFixedInstructions({
  value: hash,
}: VariableStepInstanceComponentProps<string>) {
  // Move this to dependancies
  const mapStep = useAppEntityIdSelectorEnforce(instanceSelectors, "map");
  if (mapStep.id !== "map") {
    invariant_violation();
  }
  const mapId = mapStep.value;

  const provinces = useMemo(
    () => CityResourcesEncoder.forMapId(mapId).decode(hash),
    [hash, mapId]
  );

  return (
    <Grid container textAlign="center" spacing={1}>
      {Object.entries(provinces).map(([provinceName, cities]) => {
        const mapping = Object.entries(cities);
        return (
          <React.Fragment key={provinceName}>
            <Grid key={provinceName} item xs={3} alignSelf="center">
              <Typography
                variant="subtitle1"
                sx={{ fontVariantCaps: "petite-caps" }}
              >
                {provinceName}
              </Typography>
            </Grid>
            {mapping.map(([cityName, resource]) => (
              <Grid key={cityName} item xs={3}>
                <Typography variant="caption">{resource}</Typography>
                <Typography
                  variant="body2"
                  sx={{ fontVariantCaps: "petite-caps" }}
                >
                  {cityName}
                </Typography>
              </Grid>
            ))}
            {mapping.length === 2 && <Grid item xs={3} />}
          </React.Fragment>
        );
      })}
    </Grid>
  );
}
