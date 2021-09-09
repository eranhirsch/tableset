import { Grid, Typography } from "@material-ui/core";
import React from "react";
import createDerivedGameStep, {
  DerivedStepInstanceComponentProps,
} from "../../core/steps/createDerivedGameStep";
import CityResourcesEncoder, {
  CityResourceMapping,
  Resource,
} from "../utils/CityResourcesEncoder";
import { MapId } from "../utils/Maps";
import RomanTitle from "../ux/RomanTitle";
import cityTilesStep from "./cityTilesStep";
import mapStep from "./mapStep";

type ProvinceResourceMapping = Readonly<{
  [provinceName: string]: Resource;
}>;

export default createDerivedGameStep({
  id: "bonusTiles",
  labelOverride: "Province Bonuses",

  dependencies: [mapStep, cityTilesStep],

  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [mapId, hash],
}: DerivedStepInstanceComponentProps<MapId, string>): JSX.Element | null {
  if (mapId == null) {
    // No map defined
    return <div>no map</div>;
  }

  if (hash == null) {
    // yes map, but no city tiles
    return <div>no city tiles</div>;
  }

  const provinceResource = fromCityTiles(
    CityResourcesEncoder.forMapId(mapId).decode(hash)
  );
  return (
    <Grid container>
      {Object.entries(provinceResource).map(([provinceName, resource]) => (
        <React.Fragment key={provinceName}>
          <Grid item xs={6}>
            <Typography variant="subtitle1">
              <RomanTitle>{provinceName}</RomanTitle>
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
