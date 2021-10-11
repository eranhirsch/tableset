import { Grid, Typography, useTheme } from "@mui/material";
import { useAppSelector } from "app/hooks";
import { Dict, MathUtils, Shape, Vec } from "common";
import { hasExpansionSelector } from "features/expansions/expansionsSlice";
import {
  useOptionalInstanceValue,
  useRequiredInstanceValue
} from "features/instance/useInstanceValue";
import { templateValue } from "features/template/templateSlice";
import React, { useMemo } from "react";
import {
  createRandomGameStep,
  VariableStepInstanceComponentProps
} from "../../core/steps/createRandomGameStep";
import { BlockWithFootnotes } from "../../core/ux/BlockWithFootnotes";
import { GrammaticalList } from "../../core/ux/GrammaticalList";
import { HeaderAndSteps } from "../../core/ux/HeaderAndSteps";
import CityResourcesEncoder, {
  CITY_TILES,
  REGULAR_MAPS_SALT_ALTERNATIVE,
  SALT_MAP_EXTRA_RESOURCE
} from "../utils/CityResourcesEncoder";
import { MapId, MAPS, Zone } from "../utils/Maps";
import { RESOURCE_NAME } from "../utils/resource";
import RomanTitle from "../ux/RomanTitle";
import mapStep from "./mapStep";
import salsaVariantStep from "./salsaVariantStep";

export default createRandomGameStep({
  id: "cityTiles",
  labelOverride: "City Resources",

  dependencies: [mapStep, salsaVariantStep],

  isType: (x): x is string => typeof x === "string",

  InstanceVariableComponent,
  InstanceManualComponent,

  random: (mapId, withSalsa) =>
    CityResourcesEncoder.randomHash(mapId, withSalsa),

  isTemplatable: (map) => map.willResolve(),
  refresh: () => templateValue("unchanged"),
});

function InstanceVariableComponent({
  value: hash,
}: VariableStepInstanceComponentProps<string>): JSX.Element {
  const theme = useTheme();

  // TODO: Move this to dependencies
  const mapId = useRequiredInstanceValue(mapStep);
  const withSalsa = useRequiredInstanceValue(salsaVariantStep);

  const provinces = useMemo(
    () => CityResourcesEncoder.decodeCityResources(mapId, withSalsa, hash),
    [hash, mapId, withSalsa]
  );

  return (
    <>
      <Typography variant="body1">
        Place the matching city resource tile for each city on the map:
      </Typography>
      <Grid container component="figure" sx={{ margin: 0 }}>
        {Vec.map_with_key(provinces, (provinceName, cities) => (
          <React.Fragment key={provinceName}>
            <Grid item key={provinceName} xs={3} alignSelf="center">
              <Typography variant="subtitle2">
                <RomanTitle>{provinceName}</RomanTitle>
              </Typography>
            </Grid>
            {Vec.map_with_key(cities, (cityName, resource) => (
              <Grid item key={cityName} xs={3} textAlign="center">
                <Typography variant="caption">
                  {RESOURCE_NAME[resource]}
                </Typography>
                <Typography variant="body2">
                  <RomanTitle>{cityName}</RomanTitle>
                </Typography>
              </Grid>
            ))}
            {Dict.size(cities) === 2 && <Grid item xs={3} />}
          </React.Fragment>
        ))}
        <Typography
          component="figcaption"
          variant="caption"
          sx={{ marginTop: theme.spacing(2) }}
        >
          <pre>Hash: {hash}</pre>
        </Typography>
      </Grid>
    </>
  );
}

function InstanceManualComponent() {
  const mapId = useOptionalInstanceValue(mapStep);

  const withSalsaProduct = useAppSelector(hasExpansionSelector("salsa"));
  const withSalsa = useRequiredInstanceValue(salsaVariantStep);

  return (
    <HeaderAndSteps synopsis="Set up the city resource tiles on the board:">
      <GatherStep />
      {withSalsaProduct && maybeRenderSalsaPreStep(mapId, withSalsa)}
      <>Set all tiles on the table so that their letter is showing.</>
      <>Shuffle the tiles.</>
      <>Cover each city with a tile of the same letter as the city.</>
      <>Flip all tiles so that their resource is showing.</>
      {withSalsaProduct && !withSalsa && maybeRenderSalsaPostStep(mapId)}
    </HeaderAndSteps>
  );
}

function GatherStep(): JSX.Element {
  const mapId = useOptionalInstanceValue(mapStep);
  const withSalsaProduct = useAppSelector(hasExpansionSelector("salsa"));

  const allZones = Vec.keys(CITY_TILES);

  if (mapId == null) {
    // We don't even know what map is used, we need to explain everything!
    return (
      <BlockWithFootnotes
        footnotes={[
          <GrammaticalList finalConjunction="or">{allZones}</GrammaticalList>,
          <TilesCountFootnote withSalsa={withSalsaProduct} zones={allZones} />,
        ]}
      >
        {(Footnote) => (
          <>
            Go over the cities on the board, see what letters
            <Footnote index={1} /> are used on this map, gather all city tiles
            with those letters on their back
            <Footnote index={2} />;{" "}
            <em>leaving the tiles with other letters in the box</em>.
          </>
        )}
      </BlockWithFootnotes>
    );
  }

  const { provinces } = MAPS[mapId];
  const usedZones = Vec.keys(provinces);
  const unusedZones = Vec.diff(allZones, usedZones);

  return (
    <BlockWithFootnotes
      footnotes={[
        <TilesCountFootnote withSalsa={withSalsaProduct} zones={usedZones} />,
      ]}
    >
      {(Footnote) => (
        <>
          Gather all city tiles with letters{" "}
          <GrammaticalList>{usedZones}</GrammaticalList> on their back
          <Footnote index={1} />
          {!Vec.is_empty(unusedZones) && (
            <>
              ;{" "}
              <em>
                leaving tiles with letters{" "}
                <GrammaticalList>{unusedZones}</GrammaticalList> in the box
              </em>
            </>
          )}
          .
        </>
      )}
    </BlockWithFootnotes>
  );
}

function maybeRenderSalsaPreStep(
  mapId: MapId | null,
  withSalsa: boolean
): JSX.Element | null {
  if (mapId != null && MAPS[mapId].isSaltMap) {
    // This step is only relevant for non-salt maps
    return null;
  }

  const zones =
    mapId == null ? Vec.keys(CITY_TILES) : Vec.keys(MAPS[mapId].provinces);
  return (
    <>
      {mapId == null ? (
        <>
          If <em>not</em> playing on{" "}
          <GrammaticalList finalConjunction="or">
            {React.Children.toArray(
              Vec.map_with_key(
                Dict.filter(MAPS, ({ isSaltMap }) => isSaltMap ?? false),
                (_, { name }) => <RomanTitle>{name}</RomanTitle>
              )
            )}
          </GrammaticalList>
          : r
        </>
      ) : (
        <>R</>
      )}
      eturn{" "}
      {withSalsa ? (
        <GrammaticalList>
          {React.Children.toArray(
            Vec.map_with_key(
              Dict.select_keys(REGULAR_MAPS_SALT_ALTERNATIVE, zones),
              (zone, resource) => (
                <>
                  a <strong>{RESOURCE_NAME[resource]}</strong> tile with{" "}
                  <strong>{zone}</strong> on it's back
                </>
              )
            )
          )}
        </GrammaticalList>
      ) : (
        <>
          the {zones.length} <strong>{RESOURCE_NAME.salt}</strong> tiles
        </>
      )}{" "}
      to the box
      {mapId == null && (
        <>
          ; <em>otherwise skip this step</em>
        </>
      )}
      .
    </>
  );
}

function maybeRenderSalsaPostStep(mapId: MapId | null): JSX.Element | null {
  if (mapId != null && MAPS[mapId].isSaltMap == null) {
    // This step is only relevant for salt maps
    return null;
  }

  const zones =
    mapId == null ? Vec.keys(CITY_TILES) : Vec.keys(MAPS[mapId].provinces);
  return (
    <>
      {mapId == null ? (
        <>
          If playing on{" "}
          <GrammaticalList finalConjunction="or">
            {React.Children.toArray(
              Vec.map_with_key(
                Dict.filter(MAPS, ({ isSaltMap }) => isSaltMap ?? false),
                (_, { name }) => <RomanTitle>{name}</RomanTitle>
              )
            )}
          </GrammaticalList>
          : s
        </>
      ) : (
        <>S</>
      )}
      wap the {RESOURCE_NAME.salt} tiles on the board with tiles from the box:{" "}
      <GrammaticalList>
        {React.Children.toArray(
          Vec.map_with_key(
            Dict.select_keys(SALT_MAP_EXTRA_RESOURCE, zones),
            (zone, resource) => (
              <>
                a tile with a <strong>{zone}</strong> on it's back with a{" "}
                <strong>{RESOURCE_NAME[resource]}</strong> tile
              </>
            )
          )
        )}
      </GrammaticalList>
      {mapId == null && (
        <>
          ; <em>otherwise skip this step</em>
        </>
      )}
      .
    </>
  );
}

function TilesCountFootnote({
  withSalsa,
  zones,
}: {
  withSalsa: boolean;
  zones: readonly Zone[];
}) {
  return (
    <GrammaticalList>
      {React.Children.toArray(
        Vec.map_with_key(
          Shape.select_keys(CITY_TILES, zones),
          (zone, tiles) => (
            <>
              {zone}: {MathUtils.sum(Vec.values(tiles)) + (withSalsa ? 1 : 0)}{" "}
              tiles
            </>
          )
        )
      )}
    </GrammaticalList>
  );
}
