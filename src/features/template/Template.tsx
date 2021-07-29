import {
  Chip,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from "@material-ui/core";
import { ChangeCircle } from "@material-ui/icons";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { strategyLabel } from "../../core/content";
import {
  availableItems,
  SetupStepName,
} from "../../core/games/concordia/SetupStep";
import { stepLabel } from "../../core/games/content";
import {
  defineFixedStrategy,
  nextStrategy,
  selectSetupSteps,
  SetupStep,
  Strategy,
} from "./templateSlice";

function TemplateItemSecondary({
  step,
}: {
  step: SetupStep<SetupStepName>;
}): JSX.Element {
  const dispatch = useAppDispatch();

  if (step.strategy !== Strategy.FIXED) {
    return <>{strategyLabel(step.strategy)}</>;
  }

  if (step.value != null) {
    return (
      <>
        {`${strategyLabel(Strategy.FIXED)}: `}
        <Chip
          size="small"
          label={step.value}
          onDelete={() =>
            dispatch(defineFixedStrategy({ name: step.name, value: null }))
          }
        />
      </>
    );
  }

  return (
    <>
      {`${strategyLabel(Strategy.FIXED)}: `}
      {availableItems(step.name).map((item) => (
        <Chip
          size="small"
          variant="outlined"
          label={item}
          onClick={() =>
            dispatch(defineFixedStrategy({ name: step.name, value: item }))
          }
        />
      ))}
    </>
  );
}

function TemplateItem({ step }: { step: SetupStep<SetupStepName> }) {
  const dispatch = useAppDispatch();
  return (
    <ListItem>
      <ListItemText
        primary={stepLabel(step.name)}
        secondary={<TemplateItemSecondary step={step} />}
      />
      <ListItemSecondaryAction>
        <IconButton
          edge="end"
          aria-label="change"
          onClick={() => dispatch(nextStrategy(step.name))}
        >
          <ChangeCircle />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

export function Template() {
  const setupSteps = useAppSelector(selectSetupSteps);
  return (
    <List>
      {setupSteps.map((step) => (
        <>
          <TemplateItem key={step.name} step={step} />
          <Divider />
        </>
      ))}
    </List>
  );
}
