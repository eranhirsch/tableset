import { createGameStep } from "../../core/steps/createGameStep";
import { CityTilesFixedInstructions } from "../ux/CityTilesFixedInstructions";
import { CityResourcesEncoder } from "../utils/CityResourcesEncoder";
import { MapId } from "./mapStep";

export default createGameStep<string>({
  id: "cityTiles",
  labelOverride: "City Resources",
  derivers: {
    isType(x): x is string {
      return typeof x === "string";
    },
    renderInstanceItem: (item) => <CityTilesFixedInstructions hash={item} />,
    random({ instance }) {
      const mapDef = instance.find((step) => step.id === "map");
      if (mapDef == null || mapDef.id !== "map") {
        return;
      }
      return CityResourcesEncoder.forMapId(mapDef.value as MapId).randomHash();
    },
  },
});
