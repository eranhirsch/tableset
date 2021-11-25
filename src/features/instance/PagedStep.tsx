import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { Box, Button, MobileStepper, Typography } from "@mui/material";
import { useAppSelector } from "app/hooks";
import { TSPage } from "app/ux/Chrome";
import { invariant_violation, ReactUtils } from "common";
import { gameStepSelector } from "features/game/gameSlice";
import { RandomGameStep } from "games/core/steps/createRandomGameStep";
import { DerivedGameStep } from "model/DerivedGameStep";
import { StepId } from "model/Game";
import { useParams } from "react-router-dom";
import { CloseButton } from "./CloseButton";
import { InstanceItemContent } from "./InstanceItemContent";
import { useInstanceActiveSteps } from "./useInstanceActiveSteps";

export function PagedStep(): JSX.Element {
  const { stepId } = useParams();
  if (stepId == null) {
    invariant_violation("Missing stepId param in url");
  }

  return <PagedStepInternal stepId={stepId as StepId} />;
}

function PagedStepInternal({ stepId }: { stepId: StepId }): JSX.Element {
  const navigateToSibling = ReactUtils.useNavigateToSibling();

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
              onClick={() => navigateToSibling(activeSteps[activeStep + 1].id)}
              disabled={activeStep === activeSteps.length - 1}
            >
              Next
              <KeyboardArrowRight />
            </Button>
          }
          backButton={
            <Button
              size="small"
              onClick={() => navigateToSibling(activeSteps[activeStep - 1].id)}
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

