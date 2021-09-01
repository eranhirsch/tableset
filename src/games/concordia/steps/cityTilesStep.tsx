import { createGameStep } from "../../core/steps/createGameStep";
import { CityTilesFixedInstructions } from "../ux/CityTilesFixedInstructions";
import { CityResourcesEncoder } from "../utils/CityResourcesEncoder";
import mapStep from "./mapStep";

export default createGameStep({
  id: "cityTiles",
  labelOverride: "City Resources",

  dependants: [mapStep],

  derivers: {
    isType(x): x is string {
      return typeof x === "string";
    },
    renderInstanceItem: (item: string) => (
      <CityTilesFixedInstructions hash={item} />
    ),
    random: (_, mapId) => CityResourcesEncoder.forMapId(mapId).randomHash(),
  },
});
