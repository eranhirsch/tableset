import LinkIcon from "@mui/icons-material/Link";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import { Box, Grid, IconButton, Typography } from "@mui/material";
import { Random } from "common";
import { ConfigPanelProps } from "features/template/Templatable";
import { templateValue } from "features/template/templateSlice";
import { createRandomGameStep } from "games/core/steps/createRandomGameStep";
import { PercentSlider } from "games/core/ux/PercentSlider";
import { useEffect, useState } from "react";
import { ConcordiaProductId } from "../ConcordiaProductId";
import { RESOURCE_NAME } from "../utils/resource";
import RomanTitle from "../ux/RomanTitle";
import productsMetaStep from "./productsMetaStep";
import saltVariantStep from "./saltVariant";

type TemplateConfig = { percent: number; saltPercent?: number };

export default createRandomGameStep({
  id: "variant_wineMarket",
  labelOverride: "Prices in Wine (Cards Market)",
  isVariant: true,
  dependencies: [productsMetaStep, saltVariantStep],
  isTemplatable: (products) =>
    products.willContainAny(["aegyptusCreta", "venus", "venusBase"]),
  InstanceVariableComponent,
  initialConfig: (): TemplateConfig => ({
    percent: 100,
  }),
  resolve: (config, _, withSalt): true | null =>
    Random.coin_flip(
      (withSalt ? config.saltPercent ?? config.percent : config.percent) / 100
    )
      ? true
      : null,
  onlyResolvableValue(config, _, withSaltQuery) {
    if (config == null) {
      return false;
    }

    const { percent, saltPercent } = config;

    const withSalt = withSaltQuery.onlyResolvableValue();
    if (withSalt == null && saltPercent != null) {
      // Salt is undeceive so we can't tell which percent to rely on.
      return undefined;
    }

    const relevantPercent = (withSalt ? saltPercent : null) ?? percent;
    return relevantPercent === 100
      ? true
      : relevantPercent === 0
      ? false
      : undefined;
  },

  refresh: (config, _, withSalt) =>
    config.saltPercent == null ||
    (withSalt.canResolveTo(true) && withSalt.canResolveTo(false))
      ? templateValue("unchanged")
      : // We only need to refresh the config if salt is part of the config, but
        // is no longer a variant state (it's either never, or always, both not
        // requiring a specific salt setting)
        { percent: config.percent },

  skip: (value) => value == null,

  ConfigPanel,
  ConfigPanelTLDR,
  disabledTLDROverride: "Never",
});

function ConfigPanel({
  config,
  queries: [_, withSalt],
  onChange,
}: ConfigPanelProps<
  TemplateConfig,
  readonly ConcordiaProductId[],
  boolean
>): JSX.Element {
  if (!withSalt.canResolveTo(true) || !withSalt.canResolveTo(false)) {
    // If salt is either fully turned on or fully turned off we need only to
    // show a single percent slider. It's only when it could be either that we
    // need both sliders.
    return (
      <Box textAlign="center" paddingX={1}>
        <ConfigPanelSlider value={config.percent} onChange={onChange} />
      </Box>
    );
  }

  return <MultiSliderConfigPanel config={config} onChange={onChange} />;
}

function ConfigPanelSlider({
  value,
  onChange,
}: {
  value: number;
  onChange(
    newConfig: (
      currentConfig: Readonly<TemplateConfig>
    ) => Readonly<TemplateConfig>
  ): void;
}): JSX.Element {
  return (
    <PercentSlider
      percent={value}
      onChange={(percent) =>
        onChange(({ saltPercent }) => ({ percent, saltPercent }))
      }
      preventZero
    />
  );
}

function MultiSliderConfigPanel({
  config: { percent, saltPercent },
  onChange,
}: {
  config: Readonly<TemplateConfig>;
  onChange(
    newConfig: (
      currentConfig: Readonly<TemplateConfig>
    ) => Readonly<TemplateConfig>
  ): void;
}): JSX.Element {
  const [isSync, setSync] = useState(true);

  useEffect(() => {
    // Make sure that when sync is on we don't have a specific setting for salt
    if (isSync && saltPercent != null) {
      onChange(
        // This is equivalent to removing saltPercent from the config
        ({ percent }) => ({ percent })
      );
    } else if (!isSync && saltPercent == null) {
      onChange(({ percent }) => ({
        percent,
        saltPercent: percent,
      }));
    }
  }, [saltPercent, isSync, onChange]);

  return (
    <Grid container paddingX={1} textAlign="center">
      <Grid item xs={2}>
        <Typography variant="caption">Main</Typography>
      </Grid>
      <Grid item xs={8}>
        <ConfigPanelSlider value={percent} onChange={onChange} />
      </Grid>
      <Grid item xs={2} />
      <Grid item xs={2}>
        <Typography variant="caption">With Salt</Typography>
      </Grid>
      <Grid item xs={8}>
        <PercentSlider
          disabled={isSync}
          percent={saltPercent ?? percent}
          onChange={(newSaltPercent) =>
            onChange(({ percent }) => ({
              percent,
              // When saltPercent is equal to percent we remove it, we don't
              // want to store meaningless settings.
              saltPercent:
                newSaltPercent !== percent ? newSaltPercent : undefined,
            }))
          }
        />
      </Grid>
      <Grid item xs={2} alignItems="center" justifyContent="center">
        <IconButton
          size="small"
          color={isSync ? "default" : "primary"}
          onClick={() => setSync((current) => !current)}
        >
          {isSync ? (
            <LinkIcon fontSize="small" />
          ) : (
            <LinkOffIcon fontSize="small" />
          )}
        </IconButton>
      </Grid>
    </Grid>
  );
}

function ConfigPanelTLDR({
  config: { percent, saltPercent },
}: {
  config: Readonly<TemplateConfig>;
}): JSX.Element {
  return (
    <>
      {percent === 100 ? "Always" : `${percent}% chance`}
      {saltPercent != null && saltPercent !== percent && (
        <>
          {" "}
          (
          {saltPercent === 0
            ? "Never"
            : saltPercent === 100
            ? "Always"
            : `${saltPercent}% chance when`}{" "}
          with Salt)
        </>
      )}
    </>
  );
}

function InstanceVariableComponent(): JSX.Element {
  return (
    <Typography variant="body1">
      Cards bought via a <RomanTitle>Senator</RomanTitle> now cost{" "}
      <strong>{RESOURCE_NAME.wine}</strong> as an additional resource, and not
      just {RESOURCE_NAME.cloth}.
    </Typography>
  );
}
