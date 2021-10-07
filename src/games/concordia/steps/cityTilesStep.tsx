import { Grid, Typography, useTheme } from "@mui/material";
import { useAppSelector } from "app/hooks";
import { Dict, MathUtils, Shape, Vec } from "common";
import { hasExpansionSelector } from "features/expansions/expansionsSlice";
import {
  useOptionalInstanceValue,
  useRequiredInstanceValue,
} from "features/instance/useInstanceValue";
import React, { useMemo } from "react";
import {
  createRandomGameStep,
  VariableStepInstanceComponentProps,
} from "../../core/steps/createRandomGameStep";
import { BlockWithFootnotes } from "../../core/ux/BlockWithFootnotes";
import GrammaticalList from "../../core/ux/GrammaticalList";
import HeaderAndSteps from "../../core/ux/HeaderAndSteps";
import CityResourcesEncoder, {
  CITY_TILES,
  REGULAR_MAPS_SALT_ALTERNATIVE,
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
      {withSalsaProduct && maybeRenderSalsaStep(mapId, withSalsa)}
      <>Set all tiles on the table so that their letter is showing.</>
      <>
        <strong>Shuffle</strong> the tiles.
      </>
      <>
        <strong>Cover</strong> each city with a tile of the same letter as the
        city.
      </>
      <>
        <strong>Flip</strong> all tiles so that their resource is showing.
      </>
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
            <Footnote index={1} /> are used on this map, <strong>gather</strong>{" "}
            all city tiles with those letters on their back
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
          <strong>Gather</strong> all city tiles with letters{" "}
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

function maybeRenderSalsaStep(
  mapId: MapId | null,
  withSalsa: boolean
): JSX.Element | null {
  if (mapId == null) {
    return (
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
        : return{" "}
        {withSalsa ? (
          <GrammaticalList>
            {React.Children.toArray(
              Vec.map_with_key(
                REGULAR_MAPS_SALT_ALTERNATIVE,
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
            the <strong>salt</strong> tiles
          </>
        )}{" "}
        to the box; <em>otherwise skip this step</em>.
      </>
    );
  }

  const { provinces, isSaltMap } = MAPS[mapId];
  if (isSaltMap) {
    return null;
  }

  const usedZones = Vec.keys(provinces);
  return (
    <>
      Return{" "}
      {withSalsa ? (
        <GrammaticalList>
          {React.Children.toArray(
            Vec.map_with_key(
              Dict.select_keys(REGULAR_MAPS_SALT_ALTERNATIVE, usedZones),
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
          the {usedZones.length} <strong>salt</strong> tiles
        </>
      )}{" "}
      to the box.
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
