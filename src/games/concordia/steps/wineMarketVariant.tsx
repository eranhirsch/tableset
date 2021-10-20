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
  labelOverride: "Variant: Prices in Wine (Cards Market)",
  dependencies: [productsMetaStep, saltVariantStep],
  isTemplatable: (products) =>
    products.willContainAny(["aegyptusCreta", "venus", "venusBase"]),
  InstanceVariableComponent,
  initialConfig: (): TemplateConfig => ({
    percent: 50,
  }),
  resolve: (config, _, withSalt): true | null =>
    Random.coin_flip(
      (withSalt ? config.saltPercent ?? config.percent : config.percent) / 100
    )
      ? true
      : null,
  refresh(config, _, withSalt) {
    if (withSalt.willResolve()) {
      templateValue("unchanged");
    }

    const { percent, saltPercent } = config;
    return saltPercent != null ? { percent } : templateValue("unchanged");
  },

  skip: (value) => value == null,

  ConfigPanel,
  ConfigPanelTLDR,
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
  if (!withSalt.willResolve()) {
    return (
      <Box textAlign="center">
        <ConfigPanelSlider value={config?.percent} onChange={onChange} />
      </Box>
    );
  }

  return <MultiSliderConfigPanel config={config} onChange={onChange} />;
}

function ConfigPanelSlider({
  value,
  onChange,
}: {
  value: number | undefined;
  onChange(
    newConfig: (currentConfig: TemplateConfig | undefined) => TemplateConfig
  ): void;
}): JSX.Element {
  return (
    <PercentSlider
      percent={value}
      onChange={(percent) =>
        onChange((current) => ({ percent, saltPercent: current?.saltPercent }))
      }
      preventZero
    />
  );
}

function MultiSliderConfigPanel({
  config,
  onChange,
}: {
  config: TemplateConfig | null;
  onChange(
    newConfig: (currentConfig: TemplateConfig | undefined) => TemplateConfig
  ): void;
}): JSX.Element {
  const [isSync, setSync] = useState(true);

  useEffect(() => {
    // Make sure that when sync is on we don't have a specific setting for salt
    if (isSync && config?.saltPercent != null) {
      onChange((current) => ({ percent: current!.percent }));
    } else if (!isSync && config?.saltPercent == null) {
      onChange((current) => ({
        percent: current!.percent,
        saltPercent: current!.percent,
      }));
    }
  }, [config?.saltPercent, isSync, onChange]);

  return (
    <Grid container paddingX={2}>
      <Grid item xs={2} textAlign="right">
        <Typography variant="caption">Main</Typography>
      </Grid>
      <Grid item xs={8} textAlign="center">
        <ConfigPanelSlider value={config?.percent} onChange={onChange} />
      </Grid>
      <Grid item xs={2} />
      <Grid item xs={2} textAlign="right">
        <Typography variant="caption">With Salt</Typography>
      </Grid>
      <Grid item xs={8} textAlign="center">
        <PercentSlider
          disabled={isSync}
          percent={config?.saltPercent ?? config?.percent}
          onChange={(newSaltPercent) =>
            onChange((current) => ({
              percent: current!.percent,
              saltPercent:
                newSaltPercent !== current!.percent
                  ? newSaltPercent
                  : undefined,
            }))
          }
        />
      </Grid>
      <Grid item xs={2}>
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
  config: TemplateConfig;
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
