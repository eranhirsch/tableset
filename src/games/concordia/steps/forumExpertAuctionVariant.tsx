import { Box, Typography } from "@mui/material";
import { Random } from "common";
import { ConfigPanelProps } from "features/template/Templatable";
import { templateValue } from "features/template/templateSlice";
import { createRandomGameStep } from "games/core/steps/createRandomGameStep";
import { PercentSlider } from "games/core/ux/PercentSlider";
import forumVariantStep from "./forumVariantStep";

type TemplateConfig = { percent: number };

export default createRandomGameStep({
  id: "variant_forumAuction",
  labelOverride: "Variant: Forum Expert Auction",
  dependencies: [forumVariantStep],
  isTemplatable: (forum) => forum.canResolveTo(true),
  initialConfig: () => ({ percent: 50 }),
  resolve: (config, isForum) =>
    isForum && Random.coin_flip(config.percent / 100) ? true : null,
  refresh: () => templateValue("unchanged"),
  InstanceVariableComponent,
  ConfigPanel,
  ConfigPanelTLDR,
  canResolveTo: (_, config) => config != null && config.percent > 0,
  skip: (value) => value == null,
});

function ConfigPanel({
  config,
  onChange,
}: ConfigPanelProps<TemplateConfig>): JSX.Element {
  return (
    <Box textAlign="center">
      <PercentSlider
        percent={config?.percent}
        onChange={(percent) => onChange({ percent })}
        preventZero
      />
    </Box>
  );
}

function InstanceVariableComponent(): JSX.Element {
  return (
    <Typography variant="body1">
      Players will bid points from their final score to get the starting forum
      tile they prefer.
    </Typography>
  );
}

function ConfigPanelTLDR({
  config: { percent },
}: {
  config: TemplateConfig;
}): JSX.Element {
  return percent === 100 ? <>Always</> : <>{percent}% chance</>;
}
