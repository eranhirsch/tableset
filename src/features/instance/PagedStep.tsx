import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { Box, Button, MobileStepper, Typography } from "@mui/material";
import { useAppSelector } from "app/hooks";
import { TSPage } from "app/ux/Chrome";
import { invariant_violation, Vec } from "common";
import { gameStepSelector } from "features/game/gameSlice";
import { useFeaturesContext } from "features/useFeaturesContext";
import { RandomGameStep } from "games/core/steps/createRandomGameStep";
import { DerivedGameStep } from "model/DerivedGameStep";
import { StepId } from "model/Game";
import { useNavigate, useParams } from "react-router-dom";
import { CloseButton } from "./CloseButton";
import { instanceSelectors, SetupStep } from "./instanceSlice";
import { useInstanceActiveSteps } from "./useInstanceActiveSteps";

export function PagedStep(): JSX.Element {
  const { stepId } = useParams();
  if (stepId == null) {
    invariant_violation("Missing stepId param in url");
  }

  return <PagedStepInternal stepId={stepId as StepId} />;
}

function PagedStepInternal({ stepId }: { stepId: StepId }): JSX.Element {
  const navigate = useNavigate();
  const step = useAppSelector(gameStepSelector(stepId)) as
    | RandomGameStep
    | DerivedGameStep;

  const activeSteps = useInstanceActiveSteps();

  const activeStep = activeSteps.indexOf(step);

  return (
    <TSPage>
      <Box display="flex" flexDirection="column" flexGrow={1} height="100%">
        <CloseButton />
        <Typography
          marginTop={10}
          variant="h4"
          component="header"
          color="primary"
        >
          {step.label}
        </Typography>
        <Box flexGrow={1} marginTop={5}>
          <InstanceItemContent gameStep={step} />
        </Box>
        <MobileStepper
          sx={{ flexGrow: 0 }}
          variant="text"
          steps={activeSteps.length}
          position="static"
          activeStep={activeStep}
          nextButton={
            <Button
              size="small"
              onClick={() =>
                navigate(`/instance/${activeSteps[activeStep + 1].id}`)
              }
              disabled={activeStep === activeSteps.length - 1}
            >
              Next
              <KeyboardArrowRight />
            </Button>
          }
          backButton={
            <Button
              size="small"
              onClick={() =>
                navigate(`/instance/${activeSteps[activeStep - 1].id}`)
              }
              disabled={activeStep === 0}
            >
              <KeyboardArrowLeft />
              Back
            </Button>
          }
        />
      </Box>
    </TSPage>
  );
}

function InstanceItemContent({
  gameStep,
}: {
  gameStep: RandomGameStep | DerivedGameStep;
}): JSX.Element | null {
  const instance = useAppSelector(instanceSelectors.selectEntities);
  const context = useFeaturesContext();
  const { InstanceManualComponent } = gameStep;
  if ("InstanceDerivedComponent" in gameStep) {
    return (
      <gameStep.InstanceDerivedComponent
        context={{
          ...context,
          instance:
            // redux dictionaries are really weird because they support ID types
            // which aren't used, and have undefined as part of the value.
            // We cast here to work around it...
            Vec.values(instance as Record<StepId, SetupStep>),
        }}
      />
    );
  }
  const instanceStep = instance[gameStep.id];
  if (instanceStep != null) {
    return <gameStep.InstanceVariableComponent value={instanceStep.value} />;
  }
  if (InstanceManualComponent != null) {
    if (typeof InstanceManualComponent === "string") {
      // We allow simple strings as components too, in those cases we just
      // insert them into a basic component instead
      return <Typography variant="body1">{InstanceManualComponent}</Typography>;
    }
    return <InstanceManualComponent />;
  }
  // TODO: Kill this, make InstanceManualComponent non nullable
  return <div>Manual Section</div>;
}
