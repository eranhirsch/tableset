import createComputedGameStep from "../../core/steps/createComputedGameStep";
import StartingColonists from "../ux/StartingColonists";
import mapStep from "./mapStep";

export default createComputedGameStep({
  id: "startingColonists",

  dependencies: [mapStep],

  renderComputed: (_, mapId) => <StartingColonists mapId={mapId} />,
});
