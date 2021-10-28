import { Grid, Typography } from "@mui/material";
import { Random } from "common";
import { ConfigPanelProps } from "features/template/Templatable";
import { templateValue } from "features/template/templateSlice";
import { createRandomGameStep } from "games/core/steps/createRandomGameStep";
import { PercentSlider } from "games/core/ux/PercentSlider";
import fishMarketVariant from "./fishMarketVariant";

type TemplateConfig = { percentRiver: number };

export default createRandomGameStep({
  id: "fishMarketBoard",
  dependencies: [fishMarketVariant],
  isTemplatable: (fishMarket) => fishMarket.canResolveTo(true),
  initialConfig: () => ({ percentRiver: 50 }),
  resolve: (config, withFish) =>
    withFish
      ? Random.coin_flip(config.percentRiver / 100)
        ? "river"
        : "mountain"
      : null,
  onlyResolvableValue: (config, withFish) =>
    config != null && !withFish.canResolveTo(false)
      ? config.percentRiver === 100
        ? "river"
        : config.percentRiver === 0
        ? "mountain"
        : undefined
      : undefined,

  skip: (_, [withFish]) => withFish == null,
  refresh: () => templateValue("unchanged"),
  ConfigPanel,
  ConfigPanelTLDR,
  InstanceVariableComponent,
  InstanceManualComponent,
});

function ConfigPanel({
  config: { percentRiver },
  onChange,
}: ConfigPanelProps<TemplateConfig, boolean>): JSX.Element {
  return (
    <Grid container>
      <Grid item xs={2} textAlign="right">
        <Typography variant="caption">{label("mountain")}</Typography>
      </Grid>
      <Grid item xs={8} textAlign="center">
        <PercentSlider
          track={false}
          percent={percentRiver}
          onChange={(percentRiver) => onChange({ percentRiver })}
        />
      </Grid>
      <Grid item xs={2} textAlign="left">
        <Typography variant="caption">{label("river")}</Typography>
      </Grid>
    </Grid>
  );
}

function ConfigPanelTLDR({
  config,
}: {
  config: Readonly<TemplateConfig>;
}): JSX.Element {
  if (config.percentRiver === 100) {
    return <>{label("river")}</>;
  }

  if (config.percentRiver === 0) {
    return <>{label("mountain")}</>;
  }

  if (config.percentRiver === 50) {
    return (
      <>
        {label("river")} or {label("mountain")}
      </>
    );
  }

  return (
    <>
      {config.percentRiver}% {label("river")}, {100 - config.percentRiver}%{" "}
      {label("mountain")}
    </>
  );
}

function InstanceVariableComponent({
  value,
}: {
  value: "river" | "mountain";
}): JSX.Element {
  return (
    <Typography variant="body1">
      Place the fish market board near the main board on it's{" "}
      <strong>{label(value)}</strong> side.
    </Typography>
  );
}

function InstanceManualComponent(): JSX.Element {
  return (
    <Typography variant="body1">
      Pick a side of the fish market to play on and put it near the main board.
    </Typography>
  );
}

function label(boardId: "river" | "mountain"): string {
  switch (boardId) {
    case "river":
      return "River";
    case "mountain":
      return "Mountain";
  }
}
