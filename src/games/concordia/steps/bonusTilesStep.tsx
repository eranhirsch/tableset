import { Grid, Typography } from "@mui/material";
import { Dict, Vec } from "common";
import React, { useMemo } from "react";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "../../core/steps/createDerivedGameStep";
import { BlockWithFootnotes } from "../../core/ux/BlockWithFootnotes";
import { GrammaticalList } from "../../core/ux/GrammaticalList";
import { HeaderAndSteps } from "../../core/ux/HeaderAndSteps";
import { ConcordiaProductId } from "../ConcordiaProductId";
import CityResourcesEncoder from "../utils/CityResourcesEncoder";
import { MapId, MAPS } from "../utils/MAPS";
import { RESOURCE_COST, RESOURCE_NAME } from "../utils/resource";
import RomanTitle from "../ux/RomanTitle";
import cityTilesStep from "./cityTilesStep";
import fishMarketVariant from "./fishMarketVariant";
import mapStep from "./mapStep";
import productsMetaStep from "./productsMetaStep";
import saltVariantStep from "./saltVariant";

export default createDerivedGameStep({
  id: "bonusTiles",
  labelOverride: "Province Bonuses",

  dependencies: [
    productsMetaStep,
    mapStep,
    saltVariantStep,
    cityTilesStep,
    fishMarketVariant,
  ],

  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [products, mapId, withSalt, hash, withFish],
}: DerivedStepInstanceComponentProps<
  readonly ConcordiaProductId[],
  MapId,
  boolean,
  string,
  boolean
>): JSX.Element {
  if (withFish) {
    return <FishMarket products={products!} />;
  }

  return mapId != null && hash != null ? (
    <ComputedInstanceComponent
      mapId={mapId}
      withSalt={withSalt ?? false}
      hash={hash}
    />
  ) : (
    <IncompleteInstanceDerivedComponent
      mapId={mapId}
      withSalt={withSalt}
      products={products!}
    />
  );
}

function IncompleteInstanceDerivedComponent({
  mapId,
  withSalt,
  products,
}: {
  mapId: MapId | null | undefined;
  withSalt: boolean | null | undefined;
  products: readonly ConcordiaProductId[];
}): JSX.Element {
  let mapSpecificCount;
  let provinceCityCountsFootnote;
  let tileLocationsStep;

  if (mapId != null) {
    // We dont care about zones here, so we create a merged object out of all of
    // them
    const { provinces, hasLegacyProvincesSection } = MAPS[mapId];
    const provinceCities = Dict.flatten(Vec.values(provinces));

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
        {products.includes("base") && hasLegacyProvincesSection
          ? "area of the board with the province names and thumbnails, covering the numbered province flag"
          : "mini-map area on the board, on the square pointing to the province"}
        .
      </span>
    );
  } else {
    mapSpecificCount = null;
    provinceCityCountsFootnote =
      "Most provinces have 2 cities, and a few have 3 cities.";
    tileLocationsStep = (
      <BlockWithFootnotes
        footnote={
          <>
            The board would {products.includes("base") && "either "} have a
            mini-map with lines stretching out to the bonus tile location for
            that province
            {products.includes("base") &&
              ", or it would contain a section with province names, thumbnails of the provinces, and a flag with the province number - put the tile on the flag"}
            .
          </>
        }
      >
        {(Footnote) => (
          <>
            Put a matching bonus tile, resource side up, on the location
            matching this province on the board.
            <Footnote />
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
      <BlockWithFootnotes footnote={<>{provinceCityCountsFootnote}</>}>
        {(Footnote) => (
          <>
            Find all cities in that province
            <Footnote />.
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
                  Dict.inner_join(
                    RESOURCE_NAME,
                    // Remove resources without any value.
                    Dict.filter(RESOURCE_COST, (cost) => cost > 0)
                  ),
                  // We want descending order, so we negate the value
                  ([_, cost]) => -cost
                ),
                (_, [name]) => name
              )}
            </GrammaticalList>
            {withSalt && (
              <>
                ; <em>Ignoring {RESOURCE_NAME.salt}</em>
              </>
            )}
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
  withSalt,
  hash,
}: {
  mapId: MapId;
  withSalt: boolean;
  hash: string;
}): JSX.Element | null {
  const provinceResource = useMemo(
    () => CityResourcesEncoder.decodeProvinceBonuses(mapId, withSalt, hash),
    [hash, mapId, withSalt]
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
                {resource != null ? (
                  RESOURCE_NAME[resource]
                ) : (
                  <em>(leave empty, see next step)</em>
                )}
              </Typography>
            </Grid>
          </React.Fragment>
        ))}
      </Grid>
    </>
  );
}

function FishMarket({
  products,
}: {
  products: readonly ConcordiaProductId[];
}): JSX.Element {
  return (
    <Typography variant="body1">
      Put a fish tile on the province's mini-map{" "}
      {products.includes("base") && " or the provinces section of the map"}
      for each province on the map, on the side showing a single fish.
    </Typography>
  );
}