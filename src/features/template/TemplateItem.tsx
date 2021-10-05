import {
  Collapse,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
} from "@mui/material";
import { ReactUtils } from "common";
import { StepLabel } from "features/game/StepLabel";
import { Strategy } from "features/template/Strategy";
import { StepId } from "model/Game";
import { ItemLabel } from "./ItemLabel";
import StepDetailsPane from "./StepDetailsPane";
import StrategyIcon from "./StrategyIcon";
import { templateSelectors } from "./templateSlice";

export default function TemplateItem({
  stepId,
  expanded,
  onClick,
}: {
  stepId: StepId;
  expanded: boolean;
  onClick: (isExpanded: boolean) => void;
}): JSX.Element | null {
  const element = ReactUtils.useAppEntityIdSelectorNullable(
    templateSelectors,
    stepId
  );

  if (element?.isStale) {
    // TODO: Actual loading visualization
    return <div>Loading...</div>;
  }

  return (
    <Paper sx={{ marginBottom: 1 }} elevation={expanded ? 1 : 0} component="li">
      <ListItemButton onClick={() => onClick(expanded)}>
        <ListItemIcon>
          <StrategyIcon strategy={element?.strategy ?? Strategy.OFF} />
        </ListItemIcon>
        <ListItemText secondary={<ItemLabel stepId={stepId} />}>
          <StepLabel stepId={stepId} />
        </ListItemText>
      </ListItemButton>
      <Collapse in={expanded} unmountOnExit>
        <StepDetailsPane stepId={stepId} />
      </Collapse>
    </Paper>
  );
}
