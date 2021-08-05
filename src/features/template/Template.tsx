import {
  Button,
  Chip,
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { strategyLabel } from "../../core/content";
import {
  availableItems,
  availableStrategies,
  SetupStepName,
} from "../../core/games/concordia/SetupStep";
import { stepLabel } from "../../core/games/concordia/content";
import templateSlice, {
  selectors as templateStepSelectors,
} from "./templateSlice";
import { Strategy } from "../../core/Strategy";
import PushPinIcon from "@material-ui/icons/PushPin";
import PanToolIcon from "@material-ui/icons/PanTool";
import FunctionsIcon from "@material-ui/icons/Functions";
import CasinoIcon from "@material-ui/icons/Casino";
import QuizIcon from "@material-ui/icons/Quiz";
import FlashOnIcon from "@material-ui/icons/FlashOn";
import { selectors as playersSelectors } from "../players/playersSlice";
import { EntityId } from "@reduxjs/toolkit";
import useAppEntityIdSelectorEnforce from "../../common/hooks/useAppEntityIdSelectorEnforce";

function FixedSettingsConfig({ stepId }: { stepId: EntityId }) {
  const dispatch = useAppDispatch();

  const step = useAppEntityIdSelectorEnforce(templateStepSelectors, stepId);

  const players = useAppSelector(playersSelectors.selectAll);

  if (step.value != null) {
    return (
      <Chip
        label={step.value}
        onDelete={() =>
          dispatch(templateSlice.actions.fixedValueCleared(step.name))
        }
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
            dispatch(
              templateSlice.actions.fixedValueSet({
                stepId: step.name,
                value: item,
              })
            )
          }
        />
      ))}
    </>
  );
}

function StepIcon({ stepId }: { stepId: EntityId }): JSX.Element {
  const step = useAppEntityIdSelectorEnforce(templateStepSelectors, stepId);

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

function StepDetailsPane({ stepId }: { stepId: EntityId }) {
  const dispatch = useAppDispatch();

  const step = useAppEntityIdSelectorEnforce(templateStepSelectors, stepId);
  const steps = useAppSelector(templateStepSelectors.selectEntities);

  const strategies = useMemo(
    () => availableStrategies(step.name, steps),
    [step, steps]
  );

  return (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="flex-end"
      spacing={1}
    >
      {step.strategy === Strategy.FIXED && (
        <FixedSettingsConfig stepId={stepId} />
      )}
      {(step.strategy !== Strategy.FIXED || step.value == null) &&
        strategies.map((strategy) => (
          <Button
            onClick={() =>
              dispatch(
                templateSlice.actions.strategySwapped({ id: stepId, strategy })
              )
            }
          >
            {strategyLabel(strategy)}
          </Button>
        ))}
    </Stack>
  );
}

function TemplateItem({ stepId }: { stepId: EntityId }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const step = useAppEntityIdSelectorEnforce(templateStepSelectors, stepId);

  const steps = useAppSelector(templateStepSelectors.selectEntities);
  const canSwapStrategies = useMemo(
    () => availableStrategies(stepId as SetupStepName, steps).length > 1,
    [stepId, steps]
  );

  useEffect(() => {
    if (!canSwapStrategies) {
      setIsExpanded(false);
    }
  }, [canSwapStrategies, setIsExpanded]);

  return (
    <Paper
      sx={{ marginBottom: 1 }}
      elevation={isExpanded ? 2 : canSwapStrategies ? 1 : 0}
      component="li"
    >
      <ListItemButton
        disabled={!canSwapStrategies}
        onClick={
          canSwapStrategies ? () => setIsExpanded((prev) => !prev) : undefined
        }
      >
        <ListItemIcon>
          <StepIcon stepId={stepId} />
        </ListItemIcon>
        <ListItemText secondary={strategyLabel(step.strategy)}>
          {stepLabel(stepId as SetupStepName)}
        </ListItemText>
      </ListItemButton>
      <Collapse in={isExpanded} unmountOnExit>
        <StepDetailsPane stepId={stepId} />
      </Collapse>
    </Paper>
  );
}

export function Template() {
  const dispatch = useAppDispatch();

  const stepIds = useAppSelector(templateStepSelectors.selectIds);

  useEffect(() => {
    if (stepIds.length === 0) {
      dispatch(
        templateSlice.actions.initialized([
          // TODO: We shouldn't need to initialize the template here...
          { name: "map", strategy: Strategy.OFF },
          { name: "cityTiles", strategy: Strategy.OFF },
          { name: "bonusTiles", strategy: Strategy.OFF },
          { name: "initialMarket", strategy: Strategy.OFF },
          { name: "marketDeck", strategy: Strategy.OFF },
          { name: "playerColor", strategy: Strategy.OFF },
          { name: "startingPlayer", strategy: Strategy.OFF },
          // { name: "playOrder", strategy: Strategy.OFF },
        ])
      );
    }
  }, [stepIds, dispatch]);

  return (
    <List component="ol">
      {stepIds.map((stepId) => (
        <TemplateItem stepId={stepId} />
      ))}
    </List>
  );
}
