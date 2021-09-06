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
import mapStep from "./mapStep";

function InstanceVariableComponent({
  value: hash,
}: VariableStepInstanceComponentProps<string>): JSX.Element {
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
    <Grid container textAlign="center" spacing={1}>
      {Object.entries(provinces).map(([provinceName, cities]) => {
        const mapping = Object.entries(cities);
        return (
          <React.Fragment key={provinceName}>
            <Grid key={provinceName} item xs={3} alignSelf="center">
              <Typography
                variant="subtitle1"
                sx={{ fontVariantCaps: "petite-caps" }}
              >
                {provinceName}
              </Typography>
            </Grid>
            {mapping.map(([cityName, resource]) => (
              <Grid key={cityName} item xs={3}>
                <Typography variant="caption">{resource}</Typography>
                <Typography
                  variant="body2"
                  sx={{ fontVariantCaps: "petite-caps" }}
                >
                  {cityName}
                </Typography>
              </Grid>
            ))}
            {mapping.length === 2 && <Grid item xs={3} />}
          </React.Fragment>
        );
      })}
    </Grid>
  );
}

function InstanceManualComponent() {
  const theme = useTheme();
  const mapId = useInstanceValue(mapStep);

  if (mapId == null) {
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
              footnotes={[
                <GrammaticalList>
                  {Object.entries(CITY_TILES).map(([zone, tiles]) => (
                    <React.Fragment key={`zone_${zone}`}>
                      {zone}: {Object.values(tiles).reduce((sum, x) => sum + x)}{" "}
                      tiles
                    </React.Fragment>
                  ))}
                </GrammaticalList>,
              ]}
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
          <Typography component="li" variant="body2">
            Shuffle the tiles.
          </Typography>
          <Typography component="li" variant="body2">
            Cover each city with a tile of the same letter as the city.
          </Typography>
          <Typography component="li" variant="body2">
            Flip all tiles to the side showing a resource.
          </Typography>
        </Stack>
      </>
    );
  }

  return <div>We can at least guide them what letters to use</div>;
}

export default createVariableGameStep({
  id: "cityTiles",
  labelOverride: "City Resources",

  dependencies: [mapStep],

  isType: (x): x is string => typeof x === "string",

  InstanceVariableComponent,
  InstanceManualComponent,

  random: (mapId) => CityResourcesEncoder.forMapId(mapId).randomHash(),
});
