import mapStep from "./mapStep";
import createVariableGameStep from "../../core/steps/createVariableGameStep";
import CityResourcesEncoder from "../utils/CityResourcesEncoder";
import CityTilesFixedInstructions from "../ux/CityTilesFixedInstructions";

export default createVariableGameStep({
  id: "cityTiles",
  labelOverride: "City Resources",

  dependencies: [mapStep],

  isType: (x): x is string => typeof x === "string",

  renderInstanceItem: (item: string) => (
    <CityTilesFixedInstructions hash={item} />
  ),
  random: (_, mapId) => CityResourcesEncoder.forMapId(mapId).randomHash(),
});
