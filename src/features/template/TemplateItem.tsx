import CasinoIcon from "@mui/icons-material/Casino";
import {
  Collapse,
  ListItemButton,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Switch,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { ReactUtils } from "common";
import { gameStepSelector } from "features/game/gameSlice";
import { StepLabel } from "features/game/StepLabel";
import { useFeaturesContext } from "features/useFeaturesContext";
import { StepId } from "model/Game";
import { useCallback } from "react";
import { ItemLabel } from "./ItemLabel";
import { StepConfigPanelWrapper } from "./StepConfigPanelWrapper";
import { Templatable } from "./Templatable";
import { templateActions, templateSelectors } from "./templateSlice";

export function TemplateItem({
  stepId,
  selected = false,
  onClick,
}: {
  stepId: StepId;
  selected?: boolean;
  onClick: () => void;
}): JSX.Element {
  const dispatch = useAppDispatch();

  const templatable = useAppSelector(gameStepSelector(stepId)) as Templatable;
  const context = useFeaturesContext();

  const element = ReactUtils.useAppEntityIdSelectorNullable(
    templateSelectors,
    stepId
  );

  const onChange = useCallback(
    (_, checked) => {
      if (checked) {
        if (!selected) {
          // onclick is disabled on the whole button so we need to fake
          // a click in the switch handler in that case.
          onClick();
        }
        dispatch(templateActions.enabled(templatable, context));
      } else {
        dispatch(templateActions.disabled(stepId));
      }
    },
    [context, dispatch, onClick, selected, stepId, templatable]
  );

  if (element?.isStale) {
    // TODO: Actual loading visualization
    return <div>Loading...</div>;
  }

  return (
    <Paper sx={{ marginBottom: 1 }} elevation={selected ? 1 : 0}>
      <ListItemButton onClick={element != null ? onClick : undefined}>
        <ListItemIcon>
          <CasinoIcon />
        </ListItemIcon>
        <ListItemText secondary={<ItemLabel stepId={stepId} />}>
          <StepLabel stepId={stepId} />
        </ListItemText>
        <ListItemSecondaryAction>
          <Switch edge="end" checked={element != null} onChange={onChange} />
        </ListItemSecondaryAction>
      </ListItemButton>
      <Collapse in={element != null && selected} unmountOnExit>
        <StepConfigPanelWrapper templatable={templatable} />
      </Collapse>
    </Paper>
  );
}
