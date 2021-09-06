import createGenericItemsGameStep from "../../core/steps/createGenericItemsGameStep";
import { MAPS, MapId } from "../utils/Maps";
import ConcordiaMap from "../ux/ConcordiaMap";

export default createGenericItemsGameStep({
  id: "map",
  itemIds: Object.keys(MAPS) as MapId[],

  labelFor: (id: MapId) => MAPS[id].name,
  render: ConcordiaMap,

  isType: (x: string): x is MapId => MAPS[x as MapId] != null,
  recommended: ({ playerIds }) =>
    playerIds.length <= 1
      ? undefined
      : playerIds.length <= 3
      ? "italia"
      : playerIds.length <= 5
      ? "imperium"
      : undefined,
});
