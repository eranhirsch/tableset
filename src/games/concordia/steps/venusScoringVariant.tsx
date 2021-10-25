import { Box, Typography } from "@mui/material";
import { Random } from "common";
import { ConfigPanelProps } from "features/template/Templatable";
import { templateValue } from "features/template/templateSlice";
import { createRandomGameStep } from "games/core/steps/createRandomGameStep";
import { PercentSlider } from "games/core/ux/PercentSlider";
import { ConcordiaProductId } from "../ConcordiaProductId";
import RomanTitle from "../ux/RomanTitle";
import productsMetaStep from "./productsMetaStep";
import teamPlayVariant from "./teamPlayVariant";

type TemplateConfig = { percent: number };

export default createRandomGameStep<
  boolean,
  TemplateConfig,
  readonly ConcordiaProductId[],
  boolean
>({
  id: "variant_venusScoring",
  labelOverride: "Variant: Venus Scoring",
  isType: (x: unknown): x is boolean => typeof x === "boolean",
  dependencies: [productsMetaStep, teamPlayVariant],
  isTemplatable: (products, isTeamPlay) =>
    products.willContainAny(["venus", "venusBase"]) &&
    isTeamPlay.canResolveTo(false),
  InstanceVariableComponent,
  initialConfig: (): Readonly<TemplateConfig> => ({ percent: 100 }),
  resolve: ({ percent }, _, teamPlay): true | null =>
    !teamPlay && Random.coin_flip(percent / 100) ? true : null,
  refresh: () => templateValue("unchanged"),
  skip: (value) => value == null,
  ConfigPanel,
  ConfigPanelTLDR,
  disabledTLDROverride: "Never",
  canResolveTo: (value, config) =>
    value
      ? config != null && config.percent > 0
      : config == null || config.percent < 100,
});

function ConfigPanel({
  config: { percent },
  onChange,
}: ConfigPanelProps<TemplateConfig>): JSX.Element {
  return (
    <Box textAlign="center">
      <PercentSlider
        percent={percent}
        onChange={(percent) => onChange({ percent })}
        preventZero
      />
    </Box>
  );
}

function ConfigPanelTLDR({
  config: { percent },
}: {
  config: TemplateConfig;
}): JSX.Element {
  return percent === 100 ? <>Always</> : <>{percent}% chance</>;
}

function InstanceVariableComponent(): JSX.Element {
  return (
    <Typography variant="body1">
      Cards with the goddess{" "}
      <strong>
        <RomanTitle>VENVS</RomanTitle>
      </strong>{" "}
      are added to the game; paired with a new role{" "}
      <em>
        <RomanTitle>Magister</RomanTitle>
      </em>{" "}
      added to player's starting cards, and double-role cards added to the
      market.
    </Typography>
  );
}
