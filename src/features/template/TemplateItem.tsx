import {
  Collapse,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
} from "@mui/material";
import { useAppSelector } from "../../app/hooks";
import { useAppEntityIdSelectorNullable } from "../../common/hooks/useAppEntityIdSelector";
import Strategy from "../../core/Strategy";
import { StepId } from "../../games/core/IGame";
import { gameSelector } from "../game/gameSlice";
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
  const element = useAppEntityIdSelectorNullable(templateSelectors, stepId);
  const game = useAppSelector(gameSelector);

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
          {game.atEnforce(stepId).label}
        </ListItemText>
      </ListItemButton>
      <Collapse in={expanded} unmountOnExit>
        <StepDetailsPane stepId={stepId} />
      </Collapse>
    </Paper>
  );
}
