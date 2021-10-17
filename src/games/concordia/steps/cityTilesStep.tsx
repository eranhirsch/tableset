import { Divider, Grid, Stack, Typography, useTheme } from "@mui/material";
import { useAppSelector } from "app/hooks";
import { Dict, MathUtils, Shape, Vec } from "common";
import { hasExpansionSelector } from "features/expansions/expansionsSlice";
import {
  useOptionalInstanceValue,
  useRequiredInstanceValue,
} from "features/instance/useInstanceValue";
import { templateValue } from "features/template/templateSlice";
import {
  NoSettingsConfigPanel,
  NoSettingsConfigPanelTLDR,
} from "games/core/ux/NoSettingsConfigPanel";
import React, { useMemo } from "react";
import {
  createRandomGameStep,
  VariableStepInstanceComponentProps,
} from "../../core/steps/createRandomGameStep";
import { BlockWithFootnotes } from "../../core/ux/BlockWithFootnotes";
import { GrammaticalList } from "../../core/ux/GrammaticalList";
import { HeaderAndSteps } from "../../core/ux/HeaderAndSteps";
import CityResourcesEncoder, {
  CITY_TILES,
  REGULAR_MAPS_SALT_ALTERNATIVE,
  SALT_MAP_EXTRA_RESOURCE,
} from "../utils/CityResourcesEncoder";
import { MapId, MAPS, Zone } from "../utils/MAPS";
import { RESOURCE_NAME } from "../utils/resource";
import RomanTitle from "../ux/RomanTitle";
import mapStep from "./mapStep";
import saltVariantStep from "./saltVariantStep";

export default createRandomGameStep({
  id: "cityTiles",
  labelOverride: "City Resources",

  dependencies: [mapStep, saltVariantStep],

  isType: (x): x is string => typeof x === "string",

  InstanceVariableComponent,
  InstanceManualComponent,

  isTemplatable: (map) => map.willResolve(),
  resolve: (_, mapId, withSalt) =>
    CityResourcesEncoder.randomHash(
      // We can force mapId here with `!` because the element is only
      // templatable when map will resolve (see isTemplatable)
      mapId!,
      withSalt ?? false
    ),
  initialConfig: () => ({ random: true }),
  refresh: () => templateValue("unchanged"),

  ConfigPanel: NoSettingsConfigPanel,
  ConfigPanelTLDR: NoSettingsConfigPanelTLDR,
});

function InstanceVariableComponent({
  value: hash,
}: VariableStepInstanceComponentProps<string>): JSX.Element {
  const theme = useTheme();

  // TODO: Move this to dependencies
  const mapId = useRequiredInstanceValue(mapStep);
  const withSalt = useRequiredInstanceValue(saltVariantStep);

  const provinces = useMemo(
    () => CityResourcesEncoder.decodeCityResources(mapId, withSalt, hash),
    [hash, mapId, withSalt]
  );

  return (
    <>
      <Typography variant="body1">
        Place the matching city resource tile for each city on the map:
      </Typography>
      <Stack direction="column" spacing={1}>
        {React.Children.toArray(
          Vec.map_with_key(provinces, (provinceName, cities, index) => (
            <>
              {index > 0 && <Divider />}
              <Grid container>
                <Grid item xs={3} alignSelf="center">
                  <Typography variant="subtitle2" textAlign="right">
                    <RomanTitle>{provinceName}</RomanTitle>
                  </Typography>
                </Grid>
                <Grid container item xs={9}>
                  {React.Children.toArray(
                    Vec.map_with_key(cities, (cityName, resource, index) => (
                      <Grid item xs={6} textAlign="center">
                        <Typography variant="caption">
                          {RESOURCE_NAME[resource]}
                        </Typography>
                        <Typography variant="body2">
                          <RomanTitle>{cityName}</RomanTitle>
                        </Typography>
                      </Grid>
                    ))
                  )}
                  {
                    // Fill the blanks
                    Dict.size(cities) % 2 === 1 && <Grid item xs={6} />
                  }
                </Grid>
              </Grid>
            </>
          ))
        )}
        <Typography variant="caption" sx={{ marginTop: theme.spacing(2) }}>
          <pre>Hash: {hash}</pre>
        </Typography>
      </Stack>
    </>
  );
}

function InstanceManualComponent() {
  const mapId = useOptionalInstanceValue(mapStep);

  const withSalsaProduct = useAppSelector(hasExpansionSelector("salsa"));
  const withSalt = useRequiredInstanceValue(saltVariantStep);

  return (
    <HeaderAndSteps synopsis="Set up the city resource tiles on the board:">
      <GatherStep />
      {withSalsaProduct && maybeRenderSaltPreStep(mapId, withSalt)}
      <>Set all tiles on the table so that their letter is showing.</>
      <>Shuffle the tiles.</>
      <>Cover each city with a tile of the same letter as the city.</>
      <>Flip all tiles so that their resource is showing.</>
      {withSalsaProduct && !withSalt && maybeRenderSaltPostStep(mapId)}
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
      footnote={
        <TilesCountFootnote withSalsa={withSalsaProduct} zones={usedZones} />
      }
    >
      {(Footnote) => (
        <>
          Gather all city tiles with letters{" "}
          <GrammaticalList>{usedZones}</GrammaticalList> on their back
          <Footnote />
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

function maybeRenderSaltPreStep(
  mapId: MapId | null,
  withSalt: boolean
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
      {withSalt ? (
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

function maybeRenderSaltPostStep(mapId: MapId | null): JSX.Element | null {
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
