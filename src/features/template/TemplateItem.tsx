import {
  Collapse,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
} from "@material-ui/core";
import { useMemo } from "react";
import { useAppSelector } from "../../app/hooks";
import { strategyLabel } from "../../core/content";
import ConcordiaGame, {
  SetupStepName,
} from "../../core/games/concordia/ConcordiaGame";
import { stepLabel } from "../../core/games/concordia/content";
import { selectors as templateStepSelectors } from "./templateSlice";
import StrategyIcon from "./StrategyIcon";
import StepDetailsPane from "./StepDetailsPane";
import { Strategy } from "../../core/Strategy";
import { useAppEntityIdSelectorNullable } from "../../common/hooks/useAppEntityIdSelector";

export default function TemplateItem({
  stepId,
  expanded,
  onClick,
}: {
  stepId: SetupStepName;
  expanded: boolean;
  onClick: (isExpanded: boolean) => void;
}) {
  const step = useAppEntityIdSelectorNullable(templateStepSelectors, stepId);

  const steps = useAppSelector(templateStepSelectors.selectEntities);
  const canSwapStrategies = useMemo(
    () => ConcordiaGame.strategiesFor(stepId, steps).length > 1,
    [stepId, steps]
  );

  const strategy = step?.strategy ?? Strategy.OFF;

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
          <StrategyIcon strategy={strategy} />
        </ListItemIcon>
        <ListItemText secondary={strategyLabel(strategy)}>
          {stepLabel(stepId as SetupStepName)}
        </ListItemText>
      </ListItemButton>
      <Collapse in={expanded} unmountOnExit>
        <StepDetailsPane stepId={stepId} />
      </Collapse>
    </Paper>
  );
}
