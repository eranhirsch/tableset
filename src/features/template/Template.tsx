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
import React, { useEffect } from "react";
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

function TemplateItem({ stepId }: { stepId: EntityId }) {
  const dispatch = useAppDispatch();

  const step = useAppEntityIdSelectorEnforce(templateStepSelectors, stepId);

  const steps = useAppSelector(templateStepSelectors.selectEntities);
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
              onClick={() =>
                dispatch(templateSlice.actions.strategySwapped(stepId))
              }
            >
              <ChangeCircle />
            </IconButton>
          </ListItemSecondaryAction>
        )}
    </ListItem>
  );
}

export function Template() {
  const dispatch = useAppDispatch();

  const stepIds = useAppSelector(templateStepSelectors.selectIds);

  useEffect(() => {
    if (stepIds.length === 0) {
      dispatch(
        templateSlice.actions.templateInitialized([
          // TODO: We shouldn't need to initialize the template here...
          { name: "map", strategy: Strategy.OFF },
          { name: "cityTiles", strategy: Strategy.OFF },
          { name: "bonusTiles", strategy: Strategy.OFF },
          { name: "initialMarket", strategy: Strategy.OFF },
          { name: "marketDeck", strategy: Strategy.OFF },
          { name: "playerColor", strategy: Strategy.OFF },
          { name: "startingPlayer", strategy: Strategy.OFF },
          { name: "playOrder", strategy: Strategy.OFF },
        ])
      );
    }
  }, [stepIds, dispatch]);

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
