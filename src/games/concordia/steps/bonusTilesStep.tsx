import React from "react";
import createDerivedGameStep from "../../core/steps/createDerivedGameStep";
import CityResourcesEncoder, {
  Resource,
  CityResourceMapping,
} from "../utils/CityResourcesEncoder";
import BonusTiles from "../ux/BonusTiles";
import cityTilesStep from "./cityTilesStep";
import mapStep from "./mapStep";

export type ProvinceResourceMapping = Readonly<{
  [provinceName: string]: Resource;
}>;

export default createDerivedGameStep({
  id: "bonusTiles",
  labelOverride: "Province Bonuses",

  dependencies: [mapStep, cityTilesStep],

  renderDerived: (_, mapId, hash) => (
    <BonusTiles
      provinceResource={fromCityTiles(
        CityResourcesEncoder.forMapId(mapId).decode(hash)
      )}
    />
  ),
});

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
