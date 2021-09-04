import React from "react";
import { MapId, MAPS } from "../steps/mapStep";
import GrammaticalList from "../../core/ux/GrammaticalList";
import { Typography } from "@material-ui/core";
import { DerivedStepInstanceComponentProps } from "../../core/steps/createDerivedGameStep";

export default function StartingColonists({
  dependencies: [mapId],
}: DerivedStepInstanceComponentProps<MapId>) {
  const { startingColonists } = MAPS[mapId];

  if (startingColonists[0].placement !== startingColonists[1].placement) {
    const phrases = startingColonists.map((colonist, idx) => (
      <React.Fragment key={`colonist_${idx}`}>
        1 <strong>{colonist.type}</strong> colonist from their storehouse and
        places them in
        <strong>{colonist.placement}</strong>.
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
      <strong>{startingColonists[0].placement}</strong>.
    </Typography>
  );
}
