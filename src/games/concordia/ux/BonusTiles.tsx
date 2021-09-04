import { Grid, Typography } from "@material-ui/core";
import React from "react";
import { DerivedStepInstanceComponentProps } from "../../core/steps/createDerivedGameStep";
import { MapId } from "../steps/mapStep";
import CityResourcesEncoder, {
  CityResourceMapping,
  Resource,
} from "../utils/CityResourcesEncoder";

type ProvinceResourceMapping = Readonly<{
  [provinceName: string]: Resource;
}>;

export default function BonusTiles({
  dependencies: [mapId, hash],
}: DerivedStepInstanceComponentProps<MapId, string>) {
  const provinceResource = fromCityTiles(
    CityResourcesEncoder.forMapId(mapId).decode(hash)
  );
  return (
    <Grid container>
      {Object.entries(provinceResource).map(([provinceName, resource]) => (
        <React.Fragment key={provinceName}>
          <Grid item xs={6}>
            <Typography
              variant="subtitle1"
              sx={{ fontVariantCaps: "petite-caps" }}
            >
              {provinceName}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption">{resource}</Typography>
          </Grid>
        </React.Fragment>
      ))}
    </Grid>
  );
}

function fromCityTiles(
  cityResourceMapping: CityResourceMapping
): ProvinceResourceMapping {
  return Object.fromEntries(
    Object.entries(cityResourceMapping).map(([provinceName, cities]) => [
      provinceName,
      Object.values(cities).reduce((highest, resource) => {
        const options = [highest, resource];
        return options.includes("cloth")
          ? "cloth"
          : options.includes("wine")
          ? "wine"
          : options.includes("tools")
          ? "tools"
          : options.includes("food")
          ? "food"
          : "bricks";
      }),
    ])
  );
}
