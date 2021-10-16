import { Grid, Typography } from "@mui/material";
import { Dict, Vec } from "common";
import { InstanceStepLink } from "features/instance/InstanceStepLink";
import {
  useOptionalInstanceValue,
  useRequiredInstanceValue,
} from "features/instance/useInstanceValue";
import { templateValue } from "features/template/templateSlice";
import {
  createRandomGameStep,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { NoSettingsConfigPanel } from "games/core/ux/NoSettingsConfigPanel";
import React, { useMemo } from "react";
import GermaniaCastlesEncoder, {
  EXPECTED_REMAINING_RESOURCES_COUNT,
  LOCATIONS,
  NUM_LEFT_OVER,
} from "../utils/GermaniaCastlesEncoder";
import { MapId } from "../utils/MAPS";
import { RESOURCE_COST, RESOURCE_NAME } from "../utils/resource";
import RomanTitle from "../ux/RomanTitle";
import cityTilesStep from "./cityTilesStep";
import mapStep from "./mapStep";
import productsMetaStep from "./productsMetaStep";
import saltVariantStep from "./saltVariantStep";

export default createRandomGameStep({
  id: "germaniaRomanCastles",
  labelOverride: "Roman Castles",

  isType: (value): value is string | null =>
    value == null || typeof value === "string",

  dependencies: [productsMetaStep, mapStep, saltVariantStep, cityTilesStep],

  InstanceVariableComponent,
  InstanceManualComponent,

  skip: (_: string | null, [products, map, citiesHash]) =>
    products == null || (map != null && map !== "germania"),

  isTemplatable: (products, map, _, cities) =>
    products.willContain("britanniaGermania") &&
    map.canResolveTo("germania") &&
    cities.willResolve(),
  resolve: (_config, _products, map, withSalt, cities) =>
    map === "germania"
      ? GermaniaCastlesEncoder.randomHash(
          withSalt ?? false,
          // We can force non-null because we make sure it will resolve in
          // isTemplatable
          cities!
        )
      : null,
  initialConfig: () => ({ random: true }),
  refresh: () => templateValue("unchanged"),

  ConfigPanel: NoSettingsConfigPanel,
});

function InstanceVariableComponent({
  value,
}: VariableStepInstanceComponentProps<string>): JSX.Element {
  // TODO: Move this to dependencies
  const withSalt = useRequiredInstanceValue(saltVariantStep);
  const cityTilesHash = useRequiredInstanceValue(cityTilesStep);

  const resourceLocations = useMemo(
    () => GermaniaCastlesEncoder.decode(withSalt, cityTilesHash, value),
    [cityTilesHash, value, withSalt]
  );

  return (
    <>
      <Typography variant="body1">
        Place the matching resource tiles, resource side up, on the Roman Castle
        in the following locations:
      </Typography>
      <Grid container component="figure" spacing={1}>
        {React.Children.toArray(
          Vec.map_with_key(resourceLocations, (location, resource) => (
            <>
              <Grid item xs={4} textAlign="right">
                <Typography variant="subtitle1">
                  <RomanTitle>{location}</RomanTitle>
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="caption">
                  {RESOURCE_NAME[resource]}
                </Typography>
              </Grid>
            </>
          ))
        )}
      </Grid>
    </>
  );
}

function InstanceManualComponent(): JSX.Element {
  const mapId = useOptionalInstanceValue(mapStep);
  const withSalt = useRequiredInstanceValue(saltVariantStep);
  const citiesHash = useOptionalInstanceValue(cityTilesStep);

  return (
    <HeaderAndSteps synopsis={<Header mapId={mapId} />}>
      <BlockWithFootnotes
        footnote={
          citiesHash != null ? (
            <>
              The remaining tiles would be:{" "}
              <RemainingTiles withSalt={withSalt} citiesHash={citiesHash} />
            </>
          ) : (
            <>You should have {EXPECTED_REMAINING_RESOURCES_COUNT} tiles.</>
          )
        }
      >
        {(Footnote) => (
          <>
            Take all remaining bonus tiles
            <Footnote />.
          </>
        )}
      </BlockWithFootnotes>
      <>Shuffle the tiles.</>
      <>
        For each of the {LOCATIONS.length} castles on the map pick 1 tile at
        random and put it on the castle, resource side up.
      </>
      <>Return the remaining {NUM_LEFT_OVER} tiles to the box.</>
    </HeaderAndSteps>
  );
}

function Header({ mapId }: { mapId: MapId | null }): JSX.Element {
  return (
    <BlockWithFootnotes footnote={<InstanceStepLink step={mapStep} />}>
      {(Footnote) => (
        <>
          {mapId == null ? (
            <>
              If playing on the <strong>Germania</strong> map
              <Footnote /> assign
            </>
          ) : (
            "Assign"
          )}{" "}
          a resource to each Roman Castle on the board
          {mapId == null && (
            <>
              ; <em>otherwise skip this step</em>
            </>
          )}
          :
        </>
      )}
    </BlockWithFootnotes>
  );
}

function RemainingTiles({
  withSalt,
  citiesHash,
}: {
  withSalt: boolean;
  citiesHash: string;
}): JSX.Element {
  return (
    <GrammaticalList>
      {Vec.map_with_key(
        Dict.sort_by_key(
          Dict.count_values(
            GermaniaCastlesEncoder.remainingResources(withSalt, citiesHash)
          ),
          (resource) => -RESOURCE_COST[resource]
        ),
        (resource, count) => `${count} ${RESOURCE_NAME[resource]}`
      )}
    </GrammaticalList>
  );
}
