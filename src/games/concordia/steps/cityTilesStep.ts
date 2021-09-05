import mapStep from "./mapStep";
import createVariableGameStep from "../../core/steps/createVariableGameStep";
import CityResourcesEncoder from "../utils/CityResourcesEncoder";
import CityTilesFixedInstructions from "../ux/CityTilesFixedInstructions";

export default createVariableGameStep({
  id: "cityTiles",
  labelOverride: "City Resources",

  dependencies: [mapStep],

  isType: (x): x is string => typeof x === "string",

  render: CityTilesFixedInstructions,
  random: (mapId) => CityResourcesEncoder.forMapId(mapId).randomHash(),
});
