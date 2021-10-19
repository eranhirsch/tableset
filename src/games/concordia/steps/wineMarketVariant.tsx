import LinkIcon from "@mui/icons-material/Link";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import { Box, Grid, IconButton, Slider, Typography } from "@mui/material";
import { Random, type_invariant } from "common";
import { ConfigPanelProps } from "features/template/Templatable";
import { templateValue } from "features/template/templateSlice";
import { createRandomGameStep } from "games/core/steps/createRandomGameStep";
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
      <Box width="75%" textAlign="center">
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
    <Slider
      value={value}
      min={0}
      max={100}
      step={5}
      marks={[{ value: 50, label: "\u25B2" }]}
      valueLabelDisplay="auto"
      valueLabelFormat={(percent) => `${percent}%`}
      onChange={(_, newValue) =>
        newValue !== 0 && newValue !== value
          ? onChange((current) => ({
              percent: type_invariant(newValue, isNumber),
              saltPercent: current?.saltPercent,
            }))
          : undefined
      }
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
      <Grid item xs={2}>
        <Typography variant="caption">Main</Typography>
      </Grid>
      <Grid item xs={8}>
        <ConfigPanelSlider value={config?.percent} onChange={onChange} />
      </Grid>
      <Grid item xs={2} />
      <Grid item xs={2}>
        <Typography variant="caption">With Salt</Typography>
      </Grid>
      <Grid item xs={8}>
        <Slider
          disabled={isSync}
          value={config?.saltPercent ?? config?.percent}
          min={0}
          max={100}
          step={5}
          marks={[{ value: 50, label: "\u25B2" }]}
          valueLabelDisplay="auto"
          valueLabelFormat={(percent) => `${percent}%`}
          onChange={(_, newValue) =>
            newValue !== config?.saltPercent
              ? onChange((current) => ({
                  percent: current!.percent,
                  saltPercent:
                    newValue !== config?.percent
                      ? type_invariant(newValue, isNumber)
                      : undefined,
                }))
              : undefined
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

const isNumber = (x: unknown): x is number => typeof x === "number";
