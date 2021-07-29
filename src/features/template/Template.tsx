import {
  Chip,
  Divider,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
} from "@material-ui/core";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { strategyLabel } from "../../core/content";
import { SetupStepName } from "../../core/games/concordia/SetupStep";
import { stepLabel } from "../../core/games/content";
import {
  nextStrategy,
  selectSetupSteps,
  SetupStep,
  Strategy,
} from "./templateSlice";

function TemplateItem({ step }: { step: SetupStep<SetupStepName> }) {
  const dispatch = useAppDispatch();
  return (
    <ListItem>
      <ListItemText
        primary={stepLabel(step.name)}
        secondary={
          step.strategy === Strategy.FIXED && (
            <>
              Choose:
              <Chip size="small" label="Testing" />
            </>
          )
        }
      />
      <ListItemSecondaryAction>
        <Chip
          label={strategyLabel(step.strategy)}
          onClick={() => dispatch(nextStrategy(step.name))}
        />
      </ListItemSecondaryAction>
    </ListItem>
  );
}

export function Template() {
  const setupSteps = useAppSelector(selectSetupSteps);
  return (
    <List>
      <ListSubheader>Template</ListSubheader>
      {setupSteps.map((step) => (
        <>
          <TemplateItem key={step.name} step={step} />
          <Divider />
        </>
      ))}
    </List>
  );
}
