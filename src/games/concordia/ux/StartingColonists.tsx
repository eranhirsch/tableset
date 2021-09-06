import { Typography } from "@material-ui/core";
import React from "react";
import { DerivedStepInstanceComponentProps } from "../../core/steps/createDerivedGameStep";
import GrammaticalList from "../../core/ux/GrammaticalList";
import { MapId, MAPS } from "../utils/Maps";

export default function StartingColonists({
  dependencies: [mapId],
}: DerivedStepInstanceComponentProps<MapId>): JSX.Element | null {
  const { startingColonists } = MAPS[mapId];

  if (startingColonists[0].locationName !== startingColonists[1].locationName) {
    const phrases = startingColonists.map((colonist, idx) => (
      <React.Fragment key={`colonist_${idx}`}>
        1 <strong>{colonist.type}</strong> colonist from their storehouse and
        places them in
        <strong>{colonist.locationName}</strong>.
      </React.Fragment>
    ));

    return (
      <Typography variant="body2">
        Each player takes <GrammaticalList>{phrases}</GrammaticalList>
      </Typography>
    );
  }

  const phrases = startingColonists.map((colonistLocation, idx) => (
    <React.Fragment key={`colonist_${idx}`}>
      1 <strong>{colonistLocation.type}</strong> colonist
    </React.Fragment>
  ));

  return (
    <Typography variant="body2">
      Each player takes <GrammaticalList>{phrases}</GrammaticalList> from their
      storehouse and places them in{" "}
      <strong>{startingColonists[0].locationName}</strong>.
    </Typography>
  );
}
