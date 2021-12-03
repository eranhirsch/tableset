import { Chip, Grid, Stack, Typography } from "@mui/material";
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
import { useState } from "react";
import rivalsVariant from "./rivalsVariant";
import warAndPeaceVariant from "./warAndPeaceVariant";

type TemplateConfig = { percentWar: number };

const TRACK_IDS = ["war", "peace"] as const;
export type TrackId = typeof TRACK_IDS[number];

export default createRandomGameStep({
  id: "warOrPeaceTriumphTrack",
  labelOverride: "Triumph Track: Side",

  dependencies: [warAndPeaceVariant, rivalsVariant],

  isTemplatable: (isEnabled, isRivalsEnabled) =>
    isEnabled.canResolveTo(true) && isRivalsEnabled.canResolveTo(false),

  initialConfig: { percentWar: 50 },

  resolve: ({ percentWar }, isEnabled) =>
    !isEnabled ? null : Random.coin_flip(percentWar / 100) ? "war" : "peace",

  refresh: () => templateValue("unchanged"),

  skip: (_, [isEnabled]) => !isEnabled,

  ConfigPanel,
  ConfigPanelTLDR,

  InstanceVariableComponent,
  InstanceManualComponent,
  InstanceCards,

  instanceAvroType: { type: "enum", name: "TrackId", symbols: [...TRACK_IDS] },
});

function ConfigPanel({
  config: { percentWar },
  queries: [isEnabled, isRivalsEnabled],
  onChange,
}: ConfigPanelProps<TemplateConfig, boolean, boolean>): JSX.Element {
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
      {isRivalsEnabled.canResolveTo(true) && percentWar < 100 && (
        <>
          <Grid item xs={2} />
          <Grid item xs={8}>
            <Typography variant="caption" color="error">
              This setting is ignored when {rivalsVariant.label} is enabled, in
              those cases the Peace track cannot be used.
            </Typography>
          </Grid>
          <Grid item xs={2} />
        </>
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
    <>
      <Typography variant="body1">
        Place the <em>Triumph track tile</em> showing the{" "}
        <ChosenElement>{label(trackId)}</ChosenElement> side, on the board
        covering the printed triumph track on the top left corner.
      </Typography>
      <Typography variant="subtitle1" color="primary" paddingTop={2}>
        Rules
      </Typography>
      {trackId === "war" ? <WarRules /> : <PeaceRules />}
    </>
  );
}

function InstanceManualComponent(): JSX.Element {
  const isRivals = useRequiredInstanceValue(rivalsVariant);

  const [shownRules, setShownRules] = useState<TrackId>();

  if (isRivals) {
    // Rivals cannot be played with the Peace track
    return <InstanceVariableComponent value="war" />;
  }

  return (
    <>
      <Typography variant="body1">
        Pick either side of the <em>Triumph Track</em> tile (the {label("war")}{" "}
        side or the {label("peace")} side) and place it on the board covering
        the printed triumph track on the top left corner.
      </Typography>
      <Stack direction="row" spacing={1} paddingTop={2} alignItems="center">
        <Typography variant="subtitle1" color="primary">
          Rules
        </Typography>
        <Chip
          label={label("war")}
          color="primary"
          size="small"
          variant={shownRules === "war" ? "filled" : "outlined"}
          onClick={() =>
            setShownRules((shownRules) =>
              shownRules !== "war" ? "war" : undefined
            )
          }
        />
        <Chip
          label={label("peace")}
          color="primary"
          size="small"
          variant={shownRules === "peace" ? "filled" : "outlined"}
          onClick={() =>
            setShownRules((shownRules) =>
              shownRules !== "peace" ? "peace" : undefined
            )
          }
        />
      </Stack>
      {shownRules === "war" ? (
        <WarRules />
      ) : shownRules === "peace" ? (
        <PeaceRules />
      ) : undefined}
    </>
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

function WarRules(): JSX.Element {
  return (
    // Copied verbatim from the manual, at page 16
    <ul>
      <Typography component="li" variant="body2">
        Place a star for 6 Upgrades OR 4 Structures. You may not place a star
        for both.
      </Typography>
      <Typography component="li" variant="body2">
        All players may place up to 4 combat stars. Saxony can still place
        unlimited combat and objective stars.
      </Typography>
      <Typography component="li" variant="body2">
        Place a star for having 8 Combat Cards in your hand at the end of your
        turn.
      </Typography>
      <Typography component="li" variant="body2">
        There are no stars for placing all 8 workers or maximizing Popularity on
        the War Triumph Track.
      </Typography>
    </ul>
  );
}

function PeaceRules(): JSX.Element {
  return (
    // Copied verbatim from the manual, at page 18
    <ul>
      <Typography component="li" variant="body2">
        Place a star for 4 mechs OR 4 recruits, but not both.
      </Typography>
      <Typography component="li" variant="body2">
        All players may place stars for 2 Objectives. After you place your
        objective star, instead of discarding your other objective card, draw
        another objective card (if available—do not reshuffle discarded
        objectives).
      </Typography>
      <Typography component="li" variant="body2">
        Place a star for claiming 3 encounter tokens.
      </Typography>
      <Typography component="li" variant="body2">
        Place a star for achieving 13 popularity.
      </Typography>
      <Typography component="li" variant="body2">
        Place a star for gaining a Factory card (place your star on the same
        turn that you gain the Factory card).
      </Typography>
      <Typography component="li" variant="body2">
        Place a star for controlling 16 total resources (these resources do not
        need to be on the same territory).
      </Typography>
      <Typography component="li" variant="body2">
        No stars are placed for combat victories or 16 power
      </Typography>
    </ul>
  );
}
