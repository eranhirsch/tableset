import {
  Collapse,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
} from "@material-ui/core";
import { templateSelectors } from "./templateSlice";
import StrategyIcon from "./StrategyIcon";
import StepDetailsPane from "./StepDetailsPane";
import Strategy from "../../core/Strategy";
import { useAppEntityIdSelectorNullable } from "../../common/hooks/useAppEntityIdSelector";
import { useAppSelector } from "../../app/hooks";
import { gameSelector } from "../game/gameSlice";
import { ItemLabel } from "./ItemLabel";
import { StepId } from "../../games/core/IGame";

export default function TemplateItem({
  stepId,
  expanded,
  onClick,
}: {
  stepId: StepId;
  expanded: boolean;
  onClick: (isExpanded: boolean) => void;
}): JSX.Element | null {
  const step = useAppEntityIdSelectorNullable(templateSelectors, stepId);

  const game = useAppSelector(gameSelector);

  const strategy = step?.strategy ?? Strategy.OFF;

  return (
    <Paper sx={{ marginBottom: 1 }} elevation={expanded ? 1 : 0} component="li">
      <ListItemButton onClick={() => onClick(expanded)}>
        <ListItemIcon>
          <StrategyIcon strategy={strategy} />
        </ListItemIcon>
        <ListItemText secondary={<ItemLabel stepId={stepId} />}>
          {game.at(stepId)!.label}
        </ListItemText>
      </ListItemButton>
      <Collapse in={expanded} unmountOnExit>
        <StepDetailsPane stepId={stepId} />
      </Collapse>
    </Paper>
  );
}
