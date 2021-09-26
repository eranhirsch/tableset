import { Grid, Typography, useTheme } from "@mui/material";
import { Dict, MathUtils, nullthrows, Vec } from "common";
import { useInstanceValue } from "features/instance/useInstanceValue";
import React, { useMemo } from "react";
import {
  createVariableGameStep,
  VariableStepInstanceComponentProps,
} from "../../core/steps/createVariableGameStep";
import { BlockWithFootnotes } from "../../core/ux/BlockWithFootnotes";
import GrammaticalList from "../../core/ux/GrammaticalList";
import HeaderAndSteps from "../../core/ux/HeaderAndSteps";
import CityResourcesEncoder, {
  CITY_TILES,
} from "../utils/CityResourcesEncoder";
import { MAPS, Zone } from "../utils/Maps";
import resourceLabel from "../utils/resourceLabel";
import RomanTitle from "../ux/RomanTitle";
import mapStep from "./mapStep";

export default createVariableGameStep({
  id: "cityTiles",
  labelOverride: "City Resources",

  dependencies: [mapStep],

  isType: (x): x is string => typeof x === "string",

  InstanceVariableComponent,
  InstanceManualComponent,

  random: (mapId) => CityResourcesEncoder.randomHash(mapId),
});

function InstanceVariableComponent({
  value: hash,
}: VariableStepInstanceComponentProps<string>): JSX.Element {
  const theme = useTheme();

  // TODO: Move this to dependencies
  const mapId = nullthrows(
    useInstanceValue(mapStep),
    `No map value in instance, can't build the city tiles value!`
  );

  const provinces = useMemo(
    () => CityResourcesEncoder.decode(mapId, hash),
    [hash, mapId]
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
                  {resourceLabel(resource)}
                </Typography>
                <Typography variant="body2">
                  <RomanTitle>{cityName}</RomanTitle>
                </Typography>
              </Grid>
            ))}
            {Dict.countValues(cities) === 2 && <Grid item xs={3} />}
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
  const mapId = useInstanceValue(mapStep);

  const allZones = Vec.keys(CITY_TILES);

  let lettersStep = null;
  let gatheringStep;

  if (mapId == null) {
    // We don't even know what map is used, we need to explain everything!
    lettersStep = (
      <BlockWithFootnotes
        footnotes={[<GrammaticalList>{Vec.keys(CITY_TILES)}</GrammaticalList>]}
      >
        {(Footnote) => (
          <>
            Go over the cities on the board and see what letters
            <Footnote index={1} /> are used on this map.
          </>
        )}
      </BlockWithFootnotes>
    );

    gatheringStep = (
      <BlockWithFootnotes footnotes={[<TilesCountFootnote zones={allZones} />]}>
        {(Footnote) => (
          <>
            Set all tiles
            <Footnote index={1} /> on the table so that their letter is showing,
            returning tiles you don't need back to the box.
          </>
        )}
      </BlockWithFootnotes>
    );
  } else {
    const usedZones = Vec.keys(MAPS[mapId].provinces);
    if (usedZones.length === allZones.length) {
      gatheringStep = (
        <BlockWithFootnotes
          footnotes={[<TilesCountFootnote zones={allZones} />]}
        >
          {(Footnote) => (
            <>
              Set all tiles
              <Footnote index={1} /> on the table so that their letter is
              showing.
            </>
          )}
        </BlockWithFootnotes>
      );
    } else {
      const unusedZones = allZones.filter((zone) => !usedZones.includes(zone));
      gatheringStep = (
        <BlockWithFootnotes
          footnotes={[<TilesCountFootnote zones={usedZones} />]}
        >
          {(Footnote) => (
            <>
              Set all tiles with{" "}
              <GrammaticalList pluralize="letter">{usedZones}</GrammaticalList>
              <Footnote index={1} /> on the table so that their letter is
              showing.
              {unusedZones.length > 0 && (
                <>
                  {" "}
                  Return any tile with{" "}
                  <GrammaticalList pluralize="letter">
                    {unusedZones}
                  </GrammaticalList>{" "}
                  to the box.
                </>
              )}
            </>
          )}
        </BlockWithFootnotes>
      );
    }
  }

  return (
    <HeaderAndSteps synopsis="Set up the city resource tiles on the board:">
      {lettersStep}
      {gatheringStep}
      <>Shuffle the tiles.</>
      <>Cover each city with a tile of the same letter as the city.</>
      <>Flip all tiles so that their resource is showing.</>
    </HeaderAndSteps>
  );
}

function TilesCountFootnote({ zones }: { zones: readonly Zone[] }) {
  return (
    <GrammaticalList>
      {Vec.map_with_key(
        Dict.filter_keys(CITY_TILES, (zone) => zones.includes(zone)),
        (zone, tiles) => (
          <React.Fragment key={`zone_${zone}`}>
            {zone}: {MathUtils.sum(Vec.values(tiles))} tiles
          </React.Fragment>
        )
      )}
    </GrammaticalList>
  );
}
