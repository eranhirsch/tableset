import { Typography } from "@mui/material";
import React from "react";
import createDerivedGameStep, {
  DerivedStepInstanceComponentProps,
} from "../../core/steps/createDerivedGameStep";
import { BlockWithFootnotes } from "../../core/ux/BlockWithFootnotes";
import GrammaticalList from "../../core/ux/GrammaticalList";
import { MapId, MAPS } from "../utils/Maps";
import RomanTitle from "../ux/RomanTitle";
import mapStep from "./mapStep";

export default createDerivedGameStep({
  id: "startingColonists",
  dependencies: [mapStep],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [mapId],
}: DerivedStepInstanceComponentProps<MapId>): JSX.Element | null {
  if (mapId == null) {
    // We don't know what map we are playing on, so can't say what the capital
    // is
    return (
      <BlockWithFootnotes
        footnotes={[
          <>
            On most maps there will be a single <em>capital city</em> where 1{" "}
            <strong>land</strong> colonist and 1 <strong>sea</strong> colonist
            are placed.
            {/* TODO: Add specific instructions for available maps */}
          </>,
        ]}
      >
        {(Footnote) => (
          <>
            Place 2 colonist meeples at the starting locations for the chosen
            map
            <Footnote index={1} />.
          </>
        )}
      </BlockWithFootnotes>
    );
  }

  const { startingColonists } = MAPS[mapId];

  if (startingColonists[0].locationName !== startingColonists[1].locationName) {
    return (
      <Typography variant="body1">
        Each player takes{" "}
        <GrammaticalList>
          {React.Children.toArray(
            startingColonists.map((colonist, idx) => (
              <>
                1 <strong>{colonist.type}</strong> colonist from their
                storehouse and places it in{" "}
                <strong>
                  <RomanTitle>{colonist.locationName}</RomanTitle>
                </strong>
              </>
            ))
          )}
        </GrammaticalList>
        .
      </Typography>
    );
  }

  const phrases = startingColonists.map((colonistLocation, idx) => (
    <React.Fragment key={`colonist_${idx}`}>
      1 <strong>{colonistLocation.type}</strong> colonist
    </React.Fragment>
  ));

  return (
    <Typography variant="body1">
      Each player takes <GrammaticalList>{phrases}</GrammaticalList> from their
      storehouse and places them in{" "}
      <strong>
        <RomanTitle>{startingColonists[0].locationName}</RomanTitle>
      </strong>
      .
    </Typography>
  );
}
