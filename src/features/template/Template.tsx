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
  fixedValueCleared,
  fixedValueSet,
  selectTemplateStepById,
  selectTemplateStepIds,
  selectTemplateSteps,
  strategySwapped,
} from "./templateSlice";
import { Strategy } from "../../core/Strategy";
import PushPinIcon from "@material-ui/icons/PushPin";
import PanToolIcon from "@material-ui/icons/PanTool";
import FunctionsIcon from "@material-ui/icons/Functions";
import CasinoIcon from "@material-ui/icons/Casino";
import QuizIcon from "@material-ui/icons/Quiz";
import FlashOnIcon from "@material-ui/icons/FlashOn";
import { selectAllPlayers } from "../players/playersSlice";
import { EntityId } from "@reduxjs/toolkit";
import nullthrows from "../../common/err/nullthrows";

function FixedSettingsConfig({ stepId }: { stepId: EntityId }) {
  const dispatch = useAppDispatch();

  const step = nullthrows(
    useAppSelector((state) => selectTemplateStepById(state, stepId))
  );

  const players = useAppSelector(selectAllPlayers);

  if (step.value != null) {
    return (
      <Chip
        label={step.value}
        onDelete={() => dispatch(fixedValueCleared(step.name))}
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
            dispatch(fixedValueSet({ stepId: step.name, value: item }))
          }
        />
      ))}
    </>
  );
}

function StepIcon({ stepId }: { stepId: EntityId }): JSX.Element {
  const step = nullthrows(
    useAppSelector((state) => selectTemplateStepById(state, stepId))
  );

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

function TemplateItem({ stepId }: { stepId: EntityId }) {
  const dispatch = useAppDispatch();

  const step = nullthrows(
    useAppSelector((state) => selectTemplateStepById(state, stepId))
  );

  const steps = useAppSelector(selectTemplateSteps);
  const canSwapStrategies = useMemo(
    () => availableStrategies(stepId as SetupStepName, steps).length > 1,
    [stepId, steps]
  );

  return (
    <ListItem disablePadding>
      <ListItemButton>
        <ListItemIcon>
          <StepIcon stepId={stepId} />
        </ListItemIcon>
        <ListItemText secondary={strategyLabel(step.strategy)}>
          {stepLabel(stepId as SetupStepName)}
        </ListItemText>
      </ListItemButton>
      {step.strategy === Strategy.FIXED && (
        <FixedSettingsConfig stepId={stepId} />
      )}
      {canSwapStrategies &&
        (step.strategy !== Strategy.FIXED || step.value == null) && (
          <ListItemSecondaryAction>
            <IconButton
              edge="end"
              aria-label="change"
              onClick={() => dispatch(strategySwapped(stepId))}
            >
              <ChangeCircle />
            </IconButton>
          </ListItemSecondaryAction>
        )}
    </ListItem>
  );
}

export function Template() {
  const stepIds = useAppSelector(selectTemplateStepIds);
  return (
    <>
      <List component="ol">
        {stepIds.map((stepId) => (
          <React.Fragment key={stepId}>
            <TemplateItem stepId={stepId} />
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </>
  );
}
