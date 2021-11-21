import { Grid, Typography } from "@mui/material";
import { Random } from "common";
import { InstanceCard } from "features/instance/InstanceCard";
import { useRequiredInstanceValue } from "features/instance/useInstanceValue";
import { templateValue } from "features/template/templateSlice";
import {
  ConfigPanelProps,
  createRandomGameStep,
  InstanceCardsProps,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { PercentSlider } from "games/core/ux/PercentSlider";
import modularBoardVariant from "./modularBoardVariant";
import productsMetaStep from "./productsMetaStep";

type TemplateConfig = { percentFarms: number };

export type BoardId = "farms" | "noFarms";

export default createRandomGameStep({
  id: "map",
  dependencies: [modularBoardVariant],

  isType: (x: unknown): x is BoardId => x === "farms" || x === "noFarms",

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
  InstanceCards,
});

function ConfigPanel({
  config: { percentFarms },
  queries: [isModular],
  onChange,
}: ConfigPanelProps<TemplateConfig, boolean>): JSX.Element {
  return (
    <Grid container textAlign="center">
      <Grid item xs={2}>
        <Typography variant="caption">{label("noFarms")}</Typography>
      </Grid>
      <Grid item xs={8}>
        <PercentSlider
          track={false}
          percent={percentFarms}
          onChange={(percentFarms) => onChange({ percentFarms })}
        />
      </Grid>
      <Grid item xs={2}>
        <Typography variant="caption">{label("farms")}</Typography>
      </Grid>
      {isModular.canResolveTo(false) && (
        <Grid item xs={12} textAlign="center" paddingX={10}>
          {" "}
          <Typography color="error" variant="caption">
            Ignored when <em>{modularBoardVariant.label}</em> isn't enabled.
          </Typography>
        </Grid>
      )}
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
      Place the <ChosenElement>Modular</ChosenElement> board at the center of
      the table, on the side showing{" "}
      <ChosenElement extraInfo={value === "farms" ? "hexes" : "hexes at all"}>
        {value === "farms" ? "Farm" : "No Farm"}
      </ChosenElement>
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
          Place the{" "}
          {productIds.includes("modularBoard") && (
            <ChosenElement>Regular</ChosenElement>
          )}{" "}
          board
        </>
      )}{" "}
      at the center of the table.
    </Typography>
  );
}

function InstanceCards({
  value,
  dependencies: [_isModular],
  onClick,
}: InstanceCardsProps<BoardId, boolean>): JSX.Element {
  return (
    <InstanceCard title="Board Side" subheader="Modular" onClick={onClick}>
      <Typography variant="h6" color="primary">
        <strong>{label(value)}</strong>
      </Typography>
    </InstanceCard>
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
