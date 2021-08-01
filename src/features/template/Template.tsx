import {
  Chip,
  Divider,
  IconButton,
  List,
  ListItem,
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
  selectTemplate,
  SetupStep,
} from "./templateSlice";
import { Strategy } from "../../core/Strategy";

function FixedSettingsConfig({ step }: { step: SetupStep<SetupStepName> }) {
  const dispatch = useAppDispatch();

  if (step.value != null) {
    return (
      <Chip
        label={step.value}
        onDelete={() => dispatch(defineFixedStrategy({ name: step.name }))}
      />
    );
  }

  return (
    <>
      {availableItems(step.name)!.map((item) => (
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

function TemplateItem({ step }: { step: SetupStep<SetupStepName> }) {
  const dispatch = useAppDispatch();

  const setupSteps = useAppSelector(selectTemplate);
  const strategies = useMemo(
    () => availableStrategies(step.name, setupSteps),
    [step, setupSteps]
  );

  return (
    <ListItem>
      <ListItemText secondary={strategyLabel(step.strategy)}>
        {stepLabel(step.name)}
      </ListItemText>
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
  const setupSteps = useAppSelector(selectTemplate);
  return (
    <List component="ol">
      {setupSteps.map((step) => (
        <React.Fragment key={step.name}>
          <TemplateItem step={step} />
          <Divider />
        </React.Fragment>
      ))}
    </List>
  );
}
