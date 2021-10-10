import CasinoIcon from "@mui/icons-material/Casino";
import {
  Collapse,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
} from "@mui/material";
import { ReactUtils } from "common";
import { StepLabel } from "features/game/StepLabel";
import { StepId } from "model/Game";
import { ItemLabel } from "./ItemLabel";
import StepDetailsPane from "./StepDetailsPane";
import { templateSelectors } from "./templateSlice";

export default function TemplateItem({
  stepId,
  selected = false,
  onClick,
}: {
  stepId: StepId;
  selected?: boolean;
  onClick: () => void;
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
    <Paper sx={{ marginBottom: 1 }} elevation={selected ? 1 : 0}>
      <ListItemButton onClick={onClick}>
        <ListItemIcon>
          <CasinoIcon />
        </ListItemIcon>
        <ListItemText secondary={<ItemLabel stepId={stepId} />}>
          <StepLabel stepId={stepId} />
        </ListItemText>
      </ListItemButton>
      <Collapse in={selected} unmountOnExit>
        <StepDetailsPane stepId={stepId} />
      </Collapse>
    </Paper>
  );
}
