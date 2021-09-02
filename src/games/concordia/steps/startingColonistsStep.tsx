import createComputedGameStep from "../../core/steps/createComputedGameStep";
import mapStep, { MapId, MAPS } from "./mapStep";

function StartingColonists({ mapId }: { mapId: MapId }) {
  const { startingColonists } = MAPS[mapId];

  if (startingColonists[0].placement === startingColonists[1].placement) {
    const phrases = startingColonists.map(
      (colonistLocation) => `1 ${colonistLocation.type} colonist`
    );
    return (
      <div>{`Each player takes ${phrases.join(
        " and "
      )} from their player board and places them in ${
        startingColonists[0].placement
      }`}</div>
    );
  }

  const phrases = startingColonists.map(
    (colonist) =>
      `1 ${colonist.type} colonist from their player board and places them in ${colonist.placement}`
  );

  return <div>{`Each player takes ${phrases.join(", and ")}`}</div>;
}

export default createComputedGameStep({
  id: "startingColonists",

  dependencies: [mapStep],

  renderComputed: (_, mapId) => <StartingColonists mapId={mapId} />,
});
