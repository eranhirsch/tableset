import {
  Chip,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from "@material-ui/core";
import { ChangeCircle } from "@material-ui/icons";
import React from "react";
import { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { strategyLabel } from "../../core/content";
import {
  availableItems,
  availableStrategies,
  SetupStepName,
} from "../../core/games/concordia/SetupStep";
import { stepLabel } from "../../core/games/concordia/content";
import {
  defineFixedStrategy,
  nextStrategy,
  selectPlayers,
  selectSteps,
  SetupStep,
} from "./templateSlice";
import { Strategy } from "../../core/Strategy";
import PushPinIcon from "@material-ui/icons/PushPin";
import PanToolIcon from "@material-ui/icons/PanTool";
import FunctionsIcon from "@material-ui/icons/Functions";
import CasinoIcon from "@material-ui/icons/Casino";
import QuizIcon from "@material-ui/icons/Quiz";
import FlashOnIcon from "@material-ui/icons/FlashOn";
import Players from "./Players";

function FixedSettingsConfig({ step }: { step: SetupStep<SetupStepName> }) {
  const dispatch = useAppDispatch();
  const players = useAppSelector(selectPlayers);

  if (step.value != null) {
    return (
      <Chip
        label={step.value}
        onDelete={() => dispatch(defineFixedStrategy({ name: step.name }))}
      />
    );
  }

  const items =
    step.name === "startingPlayer"
      ? players.map(({ name }) => name)
      : availableItems(step.name) ?? [];

  return (
    <>
      {items.map((item) => (
        <Chip
          key={`${step.name}_${item}`}
          size="small"
          variant="outlined"
          label={item}
          onClick={() =>
            dispatch(defineFixedStrategy({ name: step.name, value: item }))
          }
        />
      ))}
    </>
  );
}

function StepIcon({ step }: { step: SetupStep<SetupStepName> }): JSX.Element {
  switch (step.strategy) {
    case Strategy.FIXED:
      return <PushPinIcon />;
    case Strategy.MANUAL:
      return <QuizIcon />;
    case Strategy.COMPUTED:
      return <FunctionsIcon />;
    case Strategy.RANDOM:
      return <CasinoIcon />;
    case Strategy.OFF:
      return <PanToolIcon />;
    case Strategy.DEFAULT:
      return <FlashOnIcon />;
  }
}

function TemplateItem({ step }: { step: SetupStep<SetupStepName> }) {
  const dispatch = useAppDispatch();

  const steps = useAppSelector(selectSteps);
  const strategies = useMemo(
    () => availableStrategies(step.name, steps),
    [step, steps]
  );

  return (
    <ListItem disablePadding>
      <ListItemButton>
        <ListItemIcon>
          <StepIcon step={step} />
        </ListItemIcon>
        <ListItemText secondary={strategyLabel(step.strategy)}>
          {stepLabel(step.name)}
        </ListItemText>
      </ListItemButton>
      {step.strategy === Strategy.FIXED && <FixedSettingsConfig step={step} />}
      {strategies.length > 1 &&
        (step.strategy !== Strategy.FIXED || step.value == null) && (
          <ListItemSecondaryAction>
            <IconButton
              edge="end"
              aria-label="change"
              onClick={() => dispatch(nextStrategy(step.name))}
            >
              <ChangeCircle />
            </IconButton>
          </ListItemSecondaryAction>
        )}
    </ListItem>
  );
}

export function Template() {
  const steps = useAppSelector(selectSteps);
  return (
    <>
      <Players playerCount={{ min: 2, max: 5 }} />
      <List component="ol">
        {steps.map((step) => (
          <React.Fragment key={step.name}>
            <TemplateItem step={step} />
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </>
  );
}
