import { Grid, Typography } from "@mui/material";
import { Random } from "common";
import { InstanceCard } from "features/instance/InstanceCard";
import { templateValue } from "features/template/templateSlice";
import {
  ConfigPanelProps,
  createRandomGameStep,
  InstanceCardsProps,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { PercentSlider } from "games/core/ux/PercentSlider";
import warAndPeaceVariant from "./warAndPeaceVariant";

type TemplateConfig = { percentWar: number };

const TRACK_IDS = ["war", "peace"] as const;
type TrackId = typeof TRACK_IDS[number];

export default createRandomGameStep({
  id: "warOrPeaceTriumphTrack",
  labelOverride: "Triumph Track: Side",

  dependencies: [warAndPeaceVariant],

  isTemplatable: (isEnabled) => isEnabled.canResolveTo(true),

  initialConfig: { percentWar: 50 },

  resolve: ({ percentWar }, isEnabled) =>
    !isEnabled ? null : Random.coin_flip(percentWar / 100) ? "war" : "peace",

  refresh: () => templateValue("unchanged"),

  ConfigPanel,
  ConfigPanelTLDR,

  InstanceVariableComponent,
  InstanceCards,

  instanceAvroType: { type: "enum", name: "TrackId", symbols: [...TRACK_IDS] },
});

function ConfigPanel({
  config: { percentWar },
  queries: [isEnabled],
  onChange,
}: ConfigPanelProps<TemplateConfig, boolean>): JSX.Element {
  return (
    <Grid container textAlign="center">
      <Grid item xs={2}>
        <Typography variant="caption">{label("peace")}</Typography>
      </Grid>
      <Grid item xs={8}>
        <PercentSlider
          track={false}
          percent={percentWar}
          onChange={(percentWar) => onChange({ percentWar })}
        />
      </Grid>
      <Grid item xs={2}>
        <Typography variant="caption">{label("war")}</Typography>
      </Grid>
      {isEnabled.canResolveTo(false) && (
        <Grid item xs={12} textAlign="center" paddingX={10}>
          {" "}
          <Typography color="error" variant="caption">
            Ignored when <em>{warAndPeaceVariant.label}</em> isn't enabled.
          </Typography>
        </Grid>
      )}
    </Grid>
  );
}

function ConfigPanelTLDR({
  config: { percentWar },
}: {
  config: Readonly<TemplateConfig>;
}): JSX.Element {
  if (percentWar === 100) {
    return <>{label("war")}</>;
  }

  if (percentWar === 0) {
    return <>{label("peace")}</>;
  }

  if (percentWar === 50) {
    return <>Random</>;
  }

  return (
    <>
      {percentWar}% {label("war")}
    </>
  );
}

function InstanceVariableComponent({
  value: trackId,
}: VariableStepInstanceComponentProps<TrackId>): JSX.Element {
  return (
    <Typography variant="body1">
      Place the <em>Triumph track tile</em> showing the{" "}
      <ChosenElement>{label(trackId)}</ChosenElement> side, on the board
      covering the printed triumph track on the top left corner.
    </Typography>
  );
}

function InstanceCards({
  value: trackId,
  onClick,
}: InstanceCardsProps<TrackId, boolean>): JSX.Element {
  return (
    <InstanceCard title="Side" subheader="Triumph" onClick={onClick}>
      <Typography variant="h3" color="primary">
        {trackId === "peace" ? "🕊️" : "💣"}
      </Typography>
    </InstanceCard>
  );
}

function label(trackId: TrackId): string {
  switch (trackId) {
    case "peace":
      return "Peace";
    case "war":
      return "War";
  }
}
