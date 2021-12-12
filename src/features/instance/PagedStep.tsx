import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { Box, Button, MobileStepper, Paper, Typography } from "@mui/material";
import { useAppSelector } from "app/hooks";
import { TSPage } from "app/ux/Chrome";
import { invariant_violation, ReactUtils } from "common";
import { gameStepSelector } from "features/game/gameSlice";
import { RandomGameStep } from "games/core/steps/createRandomGameStep";
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

  const step = useAppSelector(gameStepSelector(stepId)) as RandomGameStep;

  const activeSteps = useInstanceActiveSteps();

  const activeStep = activeSteps.indexOf(step);

  return (
    <TSPage>
      <Box display="flex" flexDirection="column" flexGrow={1} height="100%">
        <Paper
          elevation={4}
          sx={{
            flexGrow: 1,
            marginY: 1,
            padding: 2,
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CloseButton />
          <Typography
            marginTop={4}
            variant="h4"
            component="header"
            color="primary"
          >
            {step.label}
          </Typography>
          <Box marginTop={4}>
            <InstanceItemContent gameStep={step} />
          </Box>
        </Paper>
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

