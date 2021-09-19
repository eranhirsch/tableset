import { Grid, Typography } from "@mui/material";
import React, { useMemo } from "react";
import array_sort_by from "../../../common/lib_utils/array_sort_by";
import grammatical_list from "../../../common/lib_utils/grammatical_list";
import object_filter from "../../../common/lib_utils/object_filter";
import object_map from "../../../common/lib_utils/object_map";
import createDerivedGameStep, {
  DerivedStepInstanceComponentProps,
} from "../../core/steps/createDerivedGameStep";
import { BlockWithFootnotes } from "../../core/ux/BlockWithFootnotes";
import HeaderAndSteps from "../../core/ux/HeaderAndSteps";
import CityResourcesEncoder, { Resource } from "../utils/CityResourcesEncoder";
import { MapId, MAPS } from "../utils/Maps";
import resourceLabel from "../utils/resourceLabel";
import RomanTitle from "../ux/RomanTitle";
import cityTilesStep from "./cityTilesStep";
import mapStep from "./mapStep";

const RESOURCE_PRICES: Readonly<Record<Resource, number>> = Object.freeze({
  bricks: 3,
  food: 4,
  tools: 5,
  wine: 6,
  cloth: 7,
});

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

  return <ComputedInstaneComponent mapId={mapId} hash={hash} />;
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
    const provinceCities = Object.values(provinces).reduce((merged, zone) => ({
      ...merged,
      ...zone,
    }));

    mapSpecificCount = ` of the ${
      Object.keys(provinceCities).length
    } provinces`;

    provinceCityCountsFootnote = `${grammatical_list(
      Object.keys(
        object_filter(provinceCities, (cities) => cities.length === 3)
      )
    )} have 3 cities each, the other provinces have 2 cities each.`;

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
            {grammatical_list(
              array_sort_by(
                Object.entries(RESOURCE_PRICES),
                // We want descending order, so we negate the value
                ([, value]) => -value
              ).map(([resource]) => resourceLabel(resource as Resource))
            )}
            .
          </>,
          <>
            e.g. if {resourceLabel("cloth")} is produced in one of the cities
            then the most valuable resource is {resourceLabel("cloth")}, if it
            isn't then if {resourceLabel("wine")} is produced in one of the
            cities then the most valuable resource is {resourceLabel("wine")},
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

function ComputedInstaneComponent({
  mapId,
  hash,
}: {
  mapId: MapId;
  hash: string;
}): JSX.Element | null {
  const provinceResource = useMemo(() => {
    const provinceCityResources =
      CityResourcesEncoder.forMapId(mapId).decode(hash);
    return object_map(provinceCityResources, (cityResources) =>
      Object.values(cityResources).reduce((mostValuableResource, resource) =>
        RESOURCE_PRICES[mostValuableResource] < RESOURCE_PRICES[resource]
          ? resource
          : mostValuableResource
      )
    );
  }, [hash, mapId]);

  return (
    <>
      <Typography variant="body1">
        Place the matching city resource tile for each city on the map:
      </Typography>
      <Grid container component="figure" spacing={1}>
        {Object.entries(provinceResource).map(([provinceName, resource]) => (
          <React.Fragment key={provinceName}>
            <Grid item xs={4} textAlign="right">
              <Typography variant="subtitle1">
                <RomanTitle>{provinceName}</RomanTitle>
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography variant="caption">
                {resourceLabel(resource)}
              </Typography>
            </Grid>
          </React.Fragment>
        ))}
      </Grid>
    </>
  );
}
