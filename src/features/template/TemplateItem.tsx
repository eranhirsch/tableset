import {
  Collapse,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
} from "@material-ui/core";
import { strategyLabel } from "../../core/content";
import { stepLabel } from "../../games/concordia/content";
import { selectors as templateSelectors } from "./templateSlice";
import StrategyIcon from "./StrategyIcon";
import StepDetailsPane from "./StepDetailsPane";
import { Strategy } from "../../core/Strategy";
import { useAppEntityIdSelectorNullable } from "../../common/hooks/useAppEntityIdSelector";
import { useAppSelector } from "../../app/hooks";
import { selectors as playersSelectors } from "../players/playersSlice";
import first_name from "../../common/first_name";
import { StepId } from "../../games/Game";

function ItemLabel({ stepId }: { stepId: StepId }): JSX.Element {
  const step = useAppEntityIdSelectorNullable(templateSelectors, stepId);

  const players = useAppSelector(playersSelectors.selectEntities);

  if (step == null || step.strategy !== Strategy.FIXED) {
    return <>{strategyLabel(step?.strategy ?? Strategy.OFF)}</>;
  }

  switch (step.id) {
    case "playOrder":
      if (Array.isArray(step.value)) {
        return (
          <>
            {step.value
              .map((playerId) => first_name(players[playerId]!.name))
              .join(" > ")}
          </>
        );
      }
      break;

    case "playerColors":
      if (step.value != null) {
        return (
          <>
            {Object.entries(step.value)
              .map(
                ([playerId, color]) =>
                  `${first_name(players[playerId]!.name)}: ${color}`
              )
              .join(", ")}
          </>
        );
      }
      break;
  }

  return <>{step.value}</>;
}

export default function TemplateItem({
  stepId,
  expanded,
  onClick,
}: {
  stepId: StepId;
  expanded: boolean;
  onClick: (isExpanded: boolean) => void;
}) {
  const step = useAppEntityIdSelectorNullable(templateSelectors, stepId);

  const strategy = step?.strategy ?? Strategy.OFF;

  return (
    <Paper sx={{ marginBottom: 1 }} elevation={expanded ? 1 : 0} component="li">
      <ListItemButton onClick={() => onClick(expanded)}>
        <ListItemIcon>
          <StrategyIcon strategy={strategy} />
        </ListItemIcon>
        <ListItemText secondary={<ItemLabel stepId={stepId} />}>
          {stepLabel(stepId)}
        </ListItemText>
      </ListItemButton>
      <Collapse in={expanded} unmountOnExit>
        <StepDetailsPane stepId={stepId} />
      </Collapse>
    </Paper>
  );
}
