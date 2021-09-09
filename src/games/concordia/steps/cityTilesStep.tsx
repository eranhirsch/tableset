import { Grid, Stack, Typography, useTheme } from "@material-ui/core";
import React, { useMemo } from "react";
import nullthrows from "../../../common/err/nullthrows";
import { useInstanceValue } from "../../../features/instance/useInstanceValue";
import createVariableGameStep, {
  VariableStepInstanceComponentProps,
} from "../../core/steps/createVariableGameStep";
import { BlockWithFootnotes } from "../../core/ux/BlockWithFootnotes";
import GrammaticalList from "../../core/ux/GrammaticalList";
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

  random: (mapId) => CityResourcesEncoder.forMapId(mapId).randomHash(),
});

function InstanceVariableComponent({
  value: hash,
}: VariableStepInstanceComponentProps<string>): JSX.Element {
  const theme = useTheme();

  // TODO: Move this to dependancies
  const mapId = nullthrows(
    useInstanceValue(mapStep),
    `No map value in instance, can't build the city tiles value!`
  );

  const provinces = useMemo(
    () => CityResourcesEncoder.forMapId(mapId).decode(hash),
    [hash, mapId]
  );

  return (
    <>
      <Typography variant="body1">
        Place the matching city resource tile for each city on the map:
      </Typography>
      <Grid container component="figure" sx={{ margin: 0 }}>
        {Object.entries(provinces).map(([provinceName, cities]) => {
          const mapping = Object.entries(cities);
          return (
            <React.Fragment key={provinceName}>
              <Grid item key={provinceName} xs={3} alignSelf="center">
                <Typography variant="subtitle2">
                  <RomanTitle>{provinceName}</RomanTitle>
                </Typography>
              </Grid>
              {mapping.map(([cityName, resource]) => (
                <Grid item key={cityName} xs={3} textAlign="center">
                  <Typography variant="caption">
                    {resourceLabel(resource)}
                  </Typography>
                  <Typography variant="body2">
                    <RomanTitle>{cityName}</RomanTitle>
                  </Typography>
                </Grid>
              ))}
              {mapping.length === 2 && <Grid item xs={3} />}
            </React.Fragment>
          );
        })}
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
  const theme = useTheme();

  return (
    <>
      <Typography variant="body1">
        Set up the city resource tiles on the board:
      </Typography>
      <Stack
        component="ol"
        sx={{ paddingInlineStart: theme.spacing(2) }}
        spacing={2}
      >
        <ZonesInstructions />
        <Typography component="li" variant="body2">
          Shuffle the tiles.
        </Typography>
        <Typography component="li" variant="body2">
          Cover each city with a tile of the same letter as the city.
        </Typography>
        <Typography component="li" variant="body2">
          Flip all tiles so that their resource is showing.
        </Typography>
      </Stack>
    </>
  );
}

function ZonesInstructions() {
  const mapId = useInstanceValue(mapStep);

  const allZones = Object.keys(CITY_TILES) as Zone[];

  if (mapId == null) {
    // We don't even know what map is used, we need to explain everything!
    return (
      <>
        <li>
          <BlockWithFootnotes
            footnotes={[
              <GrammaticalList>{Object.keys(CITY_TILES)}</GrammaticalList>,
            ]}
          >
            {(Footnote) => (
              <Typography variant="body2">
                Go over the cities on the board and see what letters
                <Footnote index={1} /> are used on this map.
              </Typography>
            )}
          </BlockWithFootnotes>
        </li>
        <li>
          <BlockWithFootnotes
            footnotes={[<TilesCountFootnote zones={allZones} />]}
          >
            {(Footnote) => (
              <Typography variant="body2">
                Set all tiles
                <Footnote index={1} /> on the table so that their letter is
                showing, returning tiles you don't need back to the box.
              </Typography>
            )}
          </BlockWithFootnotes>
        </li>
      </>
    );
  }

  const usedZones = Object.keys(MAPS[mapId].provinces) as Zone[];
  if (usedZones.length === allZones.length) {
    return (
      <li>
        <BlockWithFootnotes
          footnotes={[<TilesCountFootnote zones={allZones} />]}
        >
          {(Footnote) => (
            <Typography variant="body2">
              Set all tiles
              <Footnote index={1} /> on the table so that their letter is
              showing.
            </Typography>
          )}
        </BlockWithFootnotes>
      </li>
    );
  }

  const unusedZones = allZones.filter((zone) => !usedZones.includes(zone));
  return (
    <li>
      <BlockWithFootnotes
        footnotes={[<TilesCountFootnote zones={usedZones} />]}
      >
        {(Footnote) => (
          <Typography variant="body2">
            Set all tiles with{" "}
            <GrammaticalList pluralize="letter">{usedZones}</GrammaticalList>
            <Footnote index={1} /> on the table so that their letter is showing.
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
          </Typography>
        )}
      </BlockWithFootnotes>
    </li>
  );
}

function TilesCountFootnote({ zones }: { zones: Zone[] }) {
  return (
    <GrammaticalList>
      {Object.entries(CITY_TILES)
        .filter(([zone]) => zones.includes(zone as Zone))
        .map(([zone, tiles]) => (
          <React.Fragment key={`zone_${zone}`}>
            {zone}: {Object.values(tiles).reduce((sum, x) => sum + x)} tiles
          </React.Fragment>
        ))}
    </GrammaticalList>
  );
}
