import { Box, Typography } from "@mui/material";
import { Random } from "common";
import { templateValue } from "features/template/templateSlice";
import {
  ConfigPanelProps,
  createRandomGameStep,
} from "games/core/steps/createRandomGameStep";
import { PercentSlider } from "games/core/ux/PercentSlider";
import forumVariantStep from "./forumVariant";

type TemplateConfig = { percent: number };

export default createRandomGameStep({
  id: "variant_forumAuction",
  labelOverride: "Forum Expert Auction",
  isVariant: true,
  dependencies: [forumVariantStep],

  isType: (x: unknown): x is boolean => typeof x === "boolean",

  isTemplatable: (forum) => forum.canResolveTo(true),
  initialConfig: () => ({ percent: 100 }),
  resolve: (config, isForum) =>
    isForum && Random.coin_flip(config.percent / 100) ? true : null,
  onlyResolvableValue(config, isForumQuery) {
    if (config == null) {
      return false;
    }

    const isForum = isForumQuery.onlyResolvableValue();
    if (isForum == null) {
      return undefined;
    }

    return !isForum ? false : config.percent === 100 ? true : undefined;
  },
  refresh: () => templateValue("unchanged"),
  InstanceVariableComponent,
  ConfigPanel,
  ConfigPanelTLDR,
  canResolveTo: (value, config, forum) =>
    value
      ? forum.canResolveTo(true) && config != null && config.percent > 0
      : forum.canResolveTo(false) || config == null || config.percent < 100,

  skip: (value) => value == null,
  instanceAvroType: "boolean",
});

function ConfigPanel({
  config: { percent },
  onChange,
}: ConfigPanelProps<TemplateConfig>): JSX.Element {
  return (
    <Box textAlign="center" paddingX={1}>
      <PercentSlider
        percent={percent}
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
