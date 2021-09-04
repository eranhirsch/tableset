import createDerivedGameStep from "../../core/steps/createDerivedGameStep";
import StartingColonists from "../ux/StartingColonists";
import mapStep from "./mapStep";

export default createDerivedGameStep({
  id: "startingColonists",

  dependencies: [mapStep],

  renderDerived: (_, mapId) => <StartingColonists mapId={mapId} />,
});
