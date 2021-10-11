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
import { useAppDispatch } from "app/hooks";
import { ReactUtils } from "common";
import { StepLabel } from "features/game/StepLabel";
import { StepId } from "model/Game";
import { ItemLabel } from "./ItemLabel";
import { StepDetailsPane } from "./StepDetailsPane";
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

  const element = ReactUtils.useAppEntityIdSelectorNullable(
    templateSelectors,
    stepId
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
          <Switch
            edge="end"
            checked={element != null}
            onChange={(_, checked) => {
              if (checked) {
                if (!selected) {
                  // onclick is disabled on the whole button so we need to fake
                  // a click in the switch handler in that case.
                  onClick();
                }
                dispatch(templateActions.enabled(stepId));
              } else {
                dispatch(templateActions.disabled(stepId));
              }
            }}
          />
        </ListItemSecondaryAction>
      </ListItemButton>
      <Collapse in={element != null && selected} unmountOnExit>
        <StepDetailsPane stepId={stepId} />
      </Collapse>
    </Paper>
  );
}
