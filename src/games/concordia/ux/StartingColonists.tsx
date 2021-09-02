import { MapId, MAPS } from "../steps/mapStep";

export default function StartingColonists({ mapId }: { mapId: MapId }) {
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
      `1 ${colonist.type} colonist from their storehouse and places them in ${colonist.placement}`
  );

  return <div>{`Each player takes ${phrases.join(", and ")}`}</div>;
}
