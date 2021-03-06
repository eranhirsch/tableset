import {
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { $, Dict, Vec } from "common";
import { InstanceStepLink } from "features/instance/InstanceStepLink";
import {
  useOptionalInstanceValue,
  useRequiredInstanceValue,
} from "features/instance/useInstanceValue";
import { templateValue } from "features/template/templateSlice";
import {
  ConfigPanelProps,
  createRandomGameStep,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { NoConfigPanel } from "games/core/steps/NoConfigPanel";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import React, { useMemo } from "react";
import { ConcordiaProductId } from "../ConcordiaProductId";
import {
  EXPECTED_REMAINING_RESOURCES_COUNT,
  GermaniaCastles,
  LOCATIONS,
  NUM_LEFT_OVER,
} from "../utils/GermaniaCastlesEncoder";
import { MapId, MAPS } from "../utils/MAPS";
import { RESOURCE_COST, RESOURCE_NAME } from "../utils/resource";
import RomanTitle from "../ux/RomanTitle";
import cityTilesStep from "./cityTilesStep";
import mapStep from "./mapStep";
import productsMetaStep from "./productsMetaStep";
import saltVariantStep from "./saltVariant";

type TemplateConfig = { useSalsaTiles?: false };

export default createRandomGameStep({
  id: "germaniaRomanCastles",
  labelOverride: `${MAPS.germania.name}: Roman Castles`,

  isType: (value): value is string | null =>
    value == null || typeof value === "string",

  dependencies: [productsMetaStep, mapStep, saltVariantStep, cityTilesStep],

  InstanceVariableComponent,
  InstanceManualComponent,

  skip: (_: string | null, [products, map, citiesHash]) =>
    products == null || (map != null && map !== "germania"),

  isTemplatable: (products, map, _, cities) =>
    products.willContain("britanniaGermania")! &&
    map.canResolveTo("germania") &&
    cities.willResolve(),
  resolve: (config, products, map, withSalt, cities) =>
    map === "germania"
      ? GermaniaCastles.randomHash(
          withSalt ?? false,
          // We can force non-null because we make sure it will resolve in
          // isTemplatable
          cities!,
          config.useSalsaTiles ?? products!.includes("salsa")
        )
      : null,

  initialConfig: (): TemplateConfig => ({}),
  refresh: (config, products) =>
    config.useSalsaTiles == null || products.willContain("salsa")
      ? templateValue("unchanged")
      : {},
  ConfigPanel,
  ConfigPanelTLDR,

  instanceAvroType: "string",
});

function ConfigPanel({
  config: { useSalsaTiles },
  queries: [products],
  onChange,
}: ConfigPanelProps<
  TemplateConfig,
  readonly ConcordiaProductId[],
  MapId,
  boolean,
  number
>): JSX.Element {
  if (!products.willContain("salsa")) {
    return <NoConfigPanel.ConfigPanel />;
  }

  return (
    <Box>
      <FormControlLabel
        control={
          <Checkbox
            checked={useSalsaTiles ?? true}
            onChange={() =>
              onChange(({ useSalsaTiles }) =>
                useSalsaTiles != null ? {} : { useSalsaTiles: false }
              )
            }
          />
        }
        label="Include the extra tiles from the Salsa Box?"
      />
    </Box>
  );
}

function ConfigPanelTLDR({
  config,
}: {
  config: Readonly<TemplateConfig>;
}): JSX.Element {
  if (config.useSalsaTiles != null) {
    return <>Random (w/o extra tiles)</>;
  }

  return <NoConfigPanel.ConfigPanelTLDR />;
}

function InstanceVariableComponent({
  value: castlesHash,
}: VariableStepInstanceComponentProps<string>): JSX.Element {
  // TODO: Move this to dependencies
  const withSalt = useRequiredInstanceValue(saltVariantStep);
  const cityTilesHash = useRequiredInstanceValue(cityTilesStep);

  const resourceLocations = useMemo(
    () => GermaniaCastles.decode(withSalt, cityTilesHash, castlesHash),
    [castlesHash, cityTilesHash, withSalt]
  );

  return (
    <>
      <Typography variant="body1">
        Place the matching resource tiles, resource side up, on the Roman Castle
        in the following locations:
      </Typography>
      <Stack>
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
        <Typography variant="caption">
          <pre>Hash: {castlesHash}</pre>
        </Typography>
      </Stack>
    </>
  );
}

function InstanceManualComponent(): JSX.Element {
  const mapId = useOptionalInstanceValue(mapStep);
  const withSalt = useRequiredInstanceValue(saltVariantStep);
  const citiesIndex = useOptionalInstanceValue(cityTilesStep);

  return (
    <HeaderAndSteps synopsis={<Header mapId={mapId} />}>
      <BlockWithFootnotes
        footnote={
          citiesIndex != null ? (
            <>
              The remaining tiles would be:{" "}
              <RemainingTiles withSalt={withSalt} citiesIndex={citiesIndex} />
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
              <em>
                If playing on the <strong>Germania</strong> map
                <Footnote />
              </em>{" "}
              : assign
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
  citiesIndex,
}: {
  withSalt: boolean;
  citiesIndex: number;
}): JSX.Element {
  return (
    <GrammaticalList>
      {$(
        GermaniaCastles.remainingResources(
          withSalt,
          citiesIndex,
          // TODO: We abuse the withSalt param here to guess that the user
          // has the extra salsa tiles and that they want to use them.
          // ideally we should either check for the product explicitly,
          // or even tell the user about the extra tiles so they can decide
          // themselves.
          withSalt /* useSalsaTiles */
        ),
        Dict.count_values,
        ($$) => Dict.sort_by_key($$, (resource) => -RESOURCE_COST[resource]),
        ($$) =>
          Vec.map_with_key(
            $$,
            (resource, count) => `${count} ${RESOURCE_NAME[resource]}`
          )
      )}
    </GrammaticalList>
  );
}
