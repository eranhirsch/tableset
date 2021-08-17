import {
  Collapse,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
} from "@material-ui/core";
import React from "react";
import { useMemo } from "react";
import { useAppSelector } from "../../app/hooks";
import { strategyLabel } from "../../core/content";
import ConcordiaGame, {
  SetupStepName,
} from "../../core/games/concordia/ConcordiaGame";
import { stepLabel } from "../../core/games/concordia/content";
import { selectors as templateStepSelectors } from "./templateSlice";
import { EntityId } from "@reduxjs/toolkit";
import useAppEntityIdSelectorEnforce from "../../common/hooks/useAppEntityIdSelectorEnforce";
import StrategyIcon from "./StrategyIcon";
import StepDetailsPane from "./StepDetailsPane";

export default function TemplateItem({
  stepId,
  expanded,
  onClick,
}: {
  stepId: EntityId;
  expanded: boolean;
  onClick: (isExpanded: boolean) => void;
}) {
  const step = useAppEntityIdSelectorEnforce(templateStepSelectors, stepId);

  const steps = useAppSelector(templateStepSelectors.selectEntities);
  const canSwapStrategies = useMemo(
    () =>
      ConcordiaGame.strategiesFor(stepId as SetupStepName, steps).length > 1,
    [stepId, steps]
  );

  return (
    <Paper
      sx={{ marginBottom: 1 }}
      elevation={expanded ? 2 : canSwapStrategies ? 1 : 0}
      component="li"
    >
      <ListItemButton
        disabled={!canSwapStrategies}
        onClick={() => onClick(expanded)}
      >
        <ListItemIcon>
          <StrategyIcon strategy={step.strategy} />
        </ListItemIcon>
        <ListItemText secondary={strategyLabel(step.strategy)}>
          {stepLabel(stepId as SetupStepName)}
        </ListItemText>
      </ListItemButton>
      <Collapse in={expanded} unmountOnExit>
        <StepDetailsPane stepId={stepId} />
      </Collapse>
    </Paper>
  );
}
