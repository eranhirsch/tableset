import createComputedGameStep from "../../core/steps/createComputedGameStep";
import CityResourcesEncoder, {
  Resource,
  CityResourceMapping,
} from "../utils/CityResourcesEncoder";
import cityTilesStep from "./cityTilesStep";
import mapStep from "./mapStep";

type ProvinceResourceMapping = Readonly<{ [provinceName: string]: Resource }>;

export default createComputedGameStep({
  id: "bonusTiles",
  labelOverride: "Province Bonuses",

  dependencies: [mapStep, cityTilesStep],

  renderComputed: (_, mapId, hash) => {
    return (
      // TODO, make a real component here
      <div>
        {JSON.stringify(
          fromCityTiles(CityResourcesEncoder.forMapId(mapId).decode(hash))
        )}
      </div>
    );
  },
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
