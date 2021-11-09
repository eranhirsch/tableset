import { Grid, Typography } from "@mui/material";
import { Random } from "common";
import { useRequiredInstanceValue } from "features/instance/useInstanceValue";
import { ConfigPanelProps } from "features/template/Templatable";
import { templateValue } from "features/template/templateSlice";
import {
  createRandomGameStep,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { PercentSlider } from "games/core/ux/PercentSlider";
import modularBoardVariant from "./modularBoardVariant";
import productsMetaStep from "./productsMetaStep";

type TemplateConfig = { percentFarms: number };

type BoardId = "farms" | "noFarms";

export default createRandomGameStep({
  id: "map",
  dependencies: [modularBoardVariant],
  isTemplatable: (modular) => modular.canResolveTo(true),
  initialConfig: () => ({ percentFarms: 50 }),
  resolve: (config, modular) =>
    modular == null
      ? null
      : Random.coin_flip(config.percentFarms / 100)
      ? "farms"
      : "noFarms",
  refresh: () => templateValue("unchanged"),
  ConfigPanel,
  ConfigPanelTLDR,
  InstanceVariableComponent,
  InstanceManualComponent,
});

function ConfigPanel({
  config: { percentFarms },
  onChange,
}: ConfigPanelProps<TemplateConfig, boolean>): JSX.Element {
  return (
    <Grid container>
      <Grid item xs={2} textAlign="right">
        <Typography variant="caption">{label("noFarms")}</Typography>
      </Grid>
      <Grid item xs={8} textAlign="center">
        <PercentSlider
          track={false}
          percent={percentFarms}
          onChange={(percentFarms) => onChange({ percentFarms })}
        />
      </Grid>
      <Grid item xs={2} textAlign="left">
        <Typography variant="caption">{label("farms")}</Typography>
      </Grid>
    </Grid>
  );
}

function ConfigPanelTLDR({
  config: { percentFarms },
}: {
  config: Readonly<TemplateConfig>;
}): JSX.Element {
  if (percentFarms === 100) {
    return <>{label("farms")}</>;
  }

  if (percentFarms === 0) {
    return <>{label("noFarms")}</>;
  }

  if (percentFarms === 50) {
    return <>Random</>;
  }

  return (
    <>
      {percentFarms}% {label("farms")}
    </>
  );
}

function InstanceVariableComponent({
  value,
}: VariableStepInstanceComponentProps<BoardId>): JSX.Element {
  return (
    <Typography variant="body1">
      Place the <em>modular</em> board at the center of the table, on the side
      showing{" "}
      <strong>
        {value === "farms" ? "farm hexes" : "no farm hexes at all"}
      </strong>
      .
    </Typography>
  );
}

function InstanceManualComponent(): JSX.Element {
  const productIds = useRequiredInstanceValue(productsMetaStep);
  const isModular = useRequiredInstanceValue(modularBoardVariant);

  return (
    <Typography variant="body1">
      {isModular ? (
        "Pick which side of the modular board to play on and place it face-up"
      ) : (
        <>
          Place the {productIds.includes("modularBoard") && <em>regular</em>}{" "}
          board
        </>
      )}{" "}
      at the center of the table.
    </Typography>
  );
}

function label(id: BoardId): string {
  switch (id) {
    case "farms":
      return "With Farms";
    case "noFarms":
      return "No Farms";
  }
}
