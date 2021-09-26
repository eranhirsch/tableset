import { Grid, Typography } from "@mui/material";
import { Dict, nullthrows, Vec } from "common";
import React, { useMemo } from "react";
import createDerivedGameStep, {
  DerivedStepInstanceComponentProps,
} from "../../core/steps/createDerivedGameStep";
import { BlockWithFootnotes } from "../../core/ux/BlockWithFootnotes";
import GrammaticalList from "../../core/ux/GrammaticalList";
import HeaderAndSteps from "../../core/ux/HeaderAndSteps";
import CityResourcesEncoder from "../utils/CityResourcesEncoder";
import { MapId, MAPS } from "../utils/Maps";
import { Resource, resourceName, RESOURCE_COST } from "../utils/resource";
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
}: DerivedStepInstanceComponentProps<MapId, string>): JSX.Element | null {
  if (mapId == null || hash == null) {
    return <IncompleteInstanceDerivedComponent mapId={mapId} />;
  }

  return <ComputedInstanceComponent mapId={mapId} hash={hash} />;
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
    const { provinces, hasMinimap } = MAPS[mapId];
    const provinceCities = Dict.flatten(
      Vec.filter_nulls(Vec.values(provinces))
    );

    mapSpecificCount = ` of the ${Dict.countValues(provinceCities)} provinces`;

    provinceCityCountsFootnote = (
      <>
        <GrammaticalList>
          {Vec.keys(
            Dict.filter(provinceCities, (cities) => cities.length === 3)
          )}
        </GrammaticalList>{" "}
        have 3 cities each, the other provinces have 2 cities each.
      </>
    );

    tileLocationsStep = (
      <span>
        Put a matching bonus tile, resource side up, on the{" "}
        {hasMinimap
          ? "minimap area on the board, on the square pointing to the province"
          : "area of the board with the province names and thumbnails, covering the numbered province flag"}
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
              {Vec.map_with_key(
                Dict.sort_by(
                  RESOURCE_COST,
                  // We want descending order, so we negate the value
                  (value) => -value
                ),
                (resource) => resourceName(resource)
              )}
            </GrammaticalList>
            .
          </>,
          <>
            e.g. if {resourceName("cloth")} is produced in one of the cities
            then the most valuable resource is {resourceName("cloth")}, if it
            isn't then if {resourceName("wine")} is produced in one of the
            cities then the most valuable resource is {resourceName("wine")},
            etc...
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
  const provinceResource = useMemo(() => {
    const provinceCityResources = CityResourcesEncoder.decode(mapId, hash);
    return Dict.map(provinceCityResources, (cityResources) =>
      nullthrows(
        Vec.values(cityResources).reduce(
          (mostValuableResource, resource) =>
            mostValuableResource == null ||
            RESOURCE_COST[mostValuableResource] < RESOURCE_COST[resource]
              ? resource
              : mostValuableResource,
          undefined as Resource | undefined
        ),
        "Empty cityResources object encountered!"
      )
    );
  }, [hash, mapId]);

  return (
    <>
      <Typography variant="body1">
        Place the matching city resource tile for each city on the map:
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
                {resourceName(resource)}
              </Typography>
            </Grid>
          </React.Fragment>
        ))}
      </Grid>
    </>
  );
}
