import {
  Collapse,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useMemo } from "react";
import { useAppSelector } from "../../app/hooks";
import { strategyLabel } from "../../core/content";
import {
  availableStrategies,
  SetupStepName,
} from "../../core/games/concordia/SetupStep";
import { stepLabel } from "../../core/games/concordia/content";
import { selectors as templateStepSelectors } from "./templateSlice";
import { EntityId } from "@reduxjs/toolkit";
import useAppEntityIdSelectorEnforce from "../../common/hooks/useAppEntityIdSelectorEnforce";
import StrategyIcon from "./StrategyIcon";
import StepDetailsPane from "./StepDetailsPane";

export default function TemplateItem({ stepId }: { stepId: EntityId }) {
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
          <StrategyIcon strategy={step.strategy} />
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
