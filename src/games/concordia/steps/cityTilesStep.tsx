import { CityTilesFixedInstructions } from "../ux/CityTilesFixedInstructions";
import { CityResourcesEncoder } from "../utils/CityResourcesEncoder";
import mapStep from "./mapStep";
import { createDerivedGameStep } from "../../core/steps/createDerivedGameStep";

export default createDerivedGameStep({
  id: "cityTiles",
  labelOverride: "City Resources",

  dependencies: [mapStep],

  renderInstanceItem: (item: string) => (
    <CityTilesFixedInstructions hash={item} />
  ),
  random: (_, mapId) => CityResourcesEncoder.forMapId(mapId).randomHash(),
});
