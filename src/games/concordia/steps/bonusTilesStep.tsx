import { Grid, Typography } from "@mui/material";
import { Dict, Shape, Vec } from "common";
import React, { useMemo } from "react";
import createDerivedGameStep, {
  DerivedStepInstanceComponentProps,
} from "../../core/steps/createDerivedGameStep";
import { BlockWithFootnotes } from "../../core/ux/BlockWithFootnotes";
import GrammaticalList from "../../core/ux/GrammaticalList";
import HeaderAndSteps from "../../core/ux/HeaderAndSteps";
import CityResourcesEncoder from "../utils/CityResourcesEncoder";
import { MapId, MAPS } from "../utils/Maps";
import { RESOURCE_NAME, RESOURCE_COST } from "../utils/resource";
import RomanTitle from "../ux/RomanTitle";
import cityTilesStep from "./cityTilesStep";
import mapStep from "./mapStep";

export default createDerivedGameStep({
  id: "bonusTiles",
  labelOverride: "Province Bonuses",

  dependencies: [mapStep, cityTilesStep],

  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [mapId, hash],
}: DerivedStepInstanceComponentProps<MapId, string>): JSX.Element {
  return mapId != null && hash != null ? (
    <ComputedInstanceComponent mapId={mapId} hash={hash} />
  ) : (
    <IncompleteInstanceDerivedComponent mapId={mapId} />
  );
}

function IncompleteInstanceDerivedComponent({
  mapId,
}: {
  mapId: MapId | null | undefined;
}): JSX.Element {
  let mapSpecificCount;
  let provinceCityCountsFootnote;
  let tileLocationsStep;

  if (mapId != null) {
    // We dont care about zones here, so we create a merged object out of all of
    // them
    const { provinces, hasLegacyProvincesSection } = MAPS[mapId];
    const provinceCities = Dict.flatten(
      Vec.values(Shape.filter_nulls(provinces))
    );

    mapSpecificCount = ` of the ${Dict.size(provinceCities)} provinces`;

    provinceCityCountsFootnote = (
      <>
        <GrammaticalList>
          {React.Children.toArray(
            Vec.map_with_key(
              Dict.filter(provinceCities, (cities) => cities.length === 3),
              (provinceName) => <RomanTitle>{provinceName}</RomanTitle>
            )
          )}
        </GrammaticalList>{" "}
        have 3 cities each; and the other provinces have 2 cities each.
      </>
    );

    tileLocationsStep = (
      <span>
        Put a matching bonus tile, resource side up, on the{" "}
        {hasLegacyProvincesSection
          ? "area of the board with the province names and thumbnails, covering the numbered province flag"
          : "minimap area on the board, on the square pointing to the province"}
        .
      </span>
    );
  } else {
    mapSpecificCount = null;
    provinceCityCountsFootnote =
      "Most provinces have 2 cities, and a few have 3 cities.";
    tileLocationsStep = (
      <BlockWithFootnotes
        footnotes={[
          <>
            The board would either have a minimap with lines stretching out to
            the bonus tile location for that province, or it would contain a
            section with province names, thumbnails of the provinces, and a flag
            with the province number - put the tile on the flag.
          </>,
        ]}
      >
        {(Footnote) => (
          <>
            Put a matching bonus tile, resource side up, on the location
            matching this province on the board.
            <Footnote index={1} />
          </>
        )}
      </BlockWithFootnotes>
    );
  }

  return (
    <HeaderAndSteps
      synopsis={`Set up the province bonus tiles. For each${
        mapSpecificCount ?? " province"
      }:`}
    >
      <BlockWithFootnotes footnotes={[<>{provinceCityCountsFootnote}</>]}>
        {(Footnote) => (
          <>
            Find all cities in that province.
            <Footnote index={1} />
          </>
        )}
      </BlockWithFootnotes>
      <BlockWithFootnotes
        footnotes={[
          <>
            The resources (sorted in descending value) are{" "}
            <GrammaticalList>
              {Vec.values(
                Dict.sort_by_key(
                  RESOURCE_NAME,
                  // We want descending order, so we negate the value
                  (value) => -RESOURCE_COST[value]
                )
              )}
            </GrammaticalList>
            .
          </>,
          <>
            e.g. if {RESOURCE_NAME.cloth} is produced in one of the cities then
            the most valuable resource is {RESOURCE_NAME.cloth}, if it isn't
            then if {RESOURCE_NAME.wine} is produced in one of the cities then
            the most valuable resource is {RESOURCE_NAME.wine}, etc...
          </>,
        ]}
      >
        {(Footnote) => (
          <>
            Find the most valuable resource
            <Footnote index={1} /> created in those cities
            <Footnote index={2} />.
          </>
        )}
      </BlockWithFootnotes>
      {tileLocationsStep}
    </HeaderAndSteps>
  );
}

function ComputedInstanceComponent({
  mapId,
  hash,
}: {
  mapId: MapId;
  hash: string;
}): JSX.Element | null {
  const provinceResource = useMemo(
    () => CityResourcesEncoder.decodeProvinceBonuses(mapId, hash),
    [hash, mapId]
  );

  return (
    <>
      <Typography variant="body1">
        Place the matching bonus resource tile, resource side up, for each
        province{" "}
        {MAPS[mapId].hasLegacyProvincesSection
          ? "at the provinces section of the board"
          : "on the provinces mini-map"}
        :
      </Typography>
      <Grid container component="figure" spacing={1}>
        {Vec.map_with_key(provinceResource, (provinceName, resource) => (
          <React.Fragment key={provinceName}>
            <Grid item xs={4} textAlign="right">
              <Typography variant="subtitle1">
                <RomanTitle>{provinceName}</RomanTitle>
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography variant="caption">
                {RESOURCE_NAME[resource]}
              </Typography>
            </Grid>
          </React.Fragment>
        ))}
      </Grid>
    </>
  );
}
