import { Typography } from "@mui/material";
import { Vec } from "common";
import createProductDependencyMetaStep from "games/core/steps/createProductDependencyMetaStep";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import React from "react";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "../../core/steps/createDerivedGameStep";
import GrammaticalList from "../../core/ux/GrammaticalList";
import { ConcordiaProductId } from "../concordiaGame";
import { MapId, MAPS, mapsForProducts } from "../utils/Maps";
import RomanTitle from "../ux/RomanTitle";
import mapStep from "./mapStep";

export default createDerivedGameStep({
  id: "startingColonists",
  dependencies: [
    mapStep,
    createProductDependencyMetaStep<ConcordiaProductId>(),
  ],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [mapId, productIds],
}: DerivedStepInstanceComponentProps<
  MapId,
  readonly ConcordiaProductId[]
>): JSX.Element {
  if (mapId == null) {
    return (
      <UnknownMap
        availableMaps={productIds != null ? mapsForProducts(productIds) : null}
      />
    );
  }

  const { startingColonists } = MAPS[mapId];
  return startingColonists[0].locationName !==
    startingColonists[1].locationName ? (
    <DifferentLocations colonists={startingColonists} />
  ) : (
    <SameLocation colonists={startingColonists} />
  );
}

function DifferentLocations({
  colonists,
}: {
  colonists: typeof MAPS[MapId]["startingColonists"];
}): JSX.Element {
  return (
    <Typography variant="body1">
      Each player takes{" "}
      <GrammaticalList>
        {React.Children.toArray(
          colonists.map(({ type, locationName }) => (
            <>
              1 <strong>{type}</strong> colonist from their storehouse and
              places it in{" "}
              <strong>
                <RomanTitle>{locationName}</RomanTitle>
              </strong>
            </>
          ))
        )}
      </GrammaticalList>
      .
    </Typography>
  );
}

function SameLocation({
  colonists,
}: {
  colonists: typeof MAPS[MapId]["startingColonists"];
}): JSX.Element {
  return (
    <Typography variant="body1">
      Each player takes{" "}
      <GrammaticalList>
        {React.Children.toArray(
          colonists.map(({ type }) => (
            <>
              1 <strong>{type}</strong> colonist
            </>
          ))
        )}
      </GrammaticalList>{" "}
      from their storehouse and places them in{" "}
      <strong>
        <RomanTitle>{colonists[0].locationName}</RomanTitle>
      </strong>
      .
    </Typography>
  );
}

function UnknownMap({
  availableMaps,
}: {
  availableMaps: readonly MapId[] | null;
}): JSX.Element {
  const footnotes =
    availableMaps == null
      ? [
          <>
            On most maps there will be a single <em>capital city</em> where 1{" "}
            <strong>land</strong> colonist and 1 <strong>sea</strong> colonist
            are placed; Some maps have a different location for the land
            colonist and a different location for the sea colonist.
          </>,
        ]
      : Vec.map(availableMaps, (mapId) => (
          <>
            <strong>
              <RomanTitle>{MAPS[mapId].name}</RomanTitle>
            </strong>
            : <MapLocationsFootnote colonists={MAPS[mapId].startingColonists} />
          </>
        ));
  return (
    <BlockWithFootnotes footnotes={footnotes}>
      {(Footnote) => (
        <>
          Place 2 colonist meeples at the starting locations of the chosen map
          {React.Children.toArray(
            Vec.map(Vec.range(1, footnotes.length), (index) => (
              <Footnote index={index} />
            ))
          )}
          .
        </>
      )}
    </BlockWithFootnotes>
  );
}

function MapLocationsFootnote({
  colonists,
}: {
  colonists: typeof MAPS[MapId]["startingColonists"];
}): JSX.Element {
  if (colonists[0].locationName === colonists[1].locationName) {
    return (
      <>
        <GrammaticalList>
          {React.Children.toArray(
            Vec.map(colonists, ({ type }) => (
              <>
                1 <em>{type}</em> colonist
              </>
            ))
          )}
        </GrammaticalList>{" "}
        in{" "}
        <em>
          <RomanTitle>{colonists[0].locationName}</RomanTitle>
        </em>
      </>
    );
  }

  return (
    <GrammaticalList>
      {React.Children.toArray(
        Vec.map(colonists, ({ type, locationName }) => (
          <>
            1 <em>{type}</em> colonist in{" "}
            <em>
              <RomanTitle>{locationName}</RomanTitle>
            </em>
          </>
        ))
      )}
    </GrammaticalList>
  );
}
