import { useRequiredInstanceValue } from "features/instance/useInstanceValue";
import {
  createVariableGameStep,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createVariableGameStep";
import GermaniaCastlesEncoder from "../utils/GermaniaCastlesEncoder";
import cityTilesStep from "./cityTilesStep";
import mapStep from "./mapStep";

export default createVariableGameStep({
  id: "germaniaRomanCastles",
  labelOverride: "Roman Castles (Germania Map Only!)",
  isOptional: true,

  dependencies: [mapStep, cityTilesStep],

  InstanceVariableComponent,

  random: (mapId, hash) =>
    mapId === "germania"
      ? GermaniaCastlesEncoder.randomHash(mapId, hash)
      : null,
});

function InstanceVariableComponent({
  value,
}: VariableStepInstanceComponentProps<string>): JSX.Element {
  // TODO: Move this to dependencies
  const mapId = useRequiredInstanceValue(mapStep);
  const cityTilesHash = useRequiredInstanceValue(cityTilesStep);

  return (
    <div>
      {JSON.stringify(
        GermaniaCastlesEncoder.decode(mapId, cityTilesHash, value)
      )}
    </div>
  );
}
