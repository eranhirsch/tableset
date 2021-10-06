import {
  Button,
  Step,
  StepButton,
  StepContent,
  Stepper,
  Typography
} from "@mui/material";
import { Dict, Vec } from "common";
import { allExpansionIdsSelector } from "features/expansions/expansionsSlice";
import { StepLabel } from "features/game/StepLabel";
import { RandomGameStep } from "games/core/steps/createRandomGameStep";
import { DerivedGameStep } from "model/DerivedGameStep";
import React, { useEffect, useMemo, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { ProductId, StepId } from "../../model/Game";
import { PlayerId } from "../../model/Player";
import { gameStepSelector } from "../game/gameSlice";
import { playersSelectors } from "../players/playersSlice";
import {
  fullInstanceSelector,
  instanceSelectors,
  SetupStep,
} from "./instanceSlice";
import { useInstanceActiveSteps } from "./useInstanceActiveSteps";
function InstanceItemContent({
  stepId,
}: {
  stepId: StepId;
}): JSX.Element | null {
  const gameStep = useAppSelector(gameStepSelector(stepId)) as
    | RandomGameStep
    | DerivedGameStep;
  const instance = useAppSelector(instanceSelectors.selectEntities);
  const playerIds = useAppSelector(
    playersSelectors.selectIds
  ) as readonly PlayerId[];
  const productIds = useAppSelector(
    allExpansionIdsSelector
  ) as readonly ProductId[];
  const { InstanceManualComponent } = gameStep;
  if ("InstanceDerivedComponent" in gameStep) {
    return (
      <gameStep.InstanceDerivedComponent
        context={{
          instance:
            // redux dictionaries are really weird because they support ID types
            // which aren't used, and have undefined as part of the value.
            // We cast here to work around it...
            Vec.values(instance as Record<StepId, SetupStep>),
          playerIds,
          productIds,
        }}
      />
    );
  }
  const instanceStep = instance[stepId];
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
export default function Instance(): JSX.Element | null {
  const location = useLocation();
  const history = useHistory();

  const [completedSteps, setCompletedSteps] = useState<readonly StepId[]>([]);

  const activeSteps = useInstanceActiveSteps();

  // Just for logging, dump the full instance, normalized
  const fullInstance = useAppSelector(fullInstanceSelector);
  useEffect(() => {
    console.log("INSTANCE", Dict.sort_by_key(fullInstance));
  }, [fullInstance]);

  const groups = useMemo(
    () =>
      activeSteps
        .reduce(
          (groups, step) => {
            if (
              !(
                "InstanceDerivedComponent" in step ||
                "InstanceVariableComponent" in step
              )
            ) {
              // Trivial steps dont have any special component rendering defined,
              // they will ALWAYS render exactly the same, so we group them to
              // make it easier to skip them
              groups[groups.length - 1].push(step.id);
              return groups;
            }
            // We need to create a new group for each non-manual step and
            // push an additional group after the step so that the next
            // iterations' doesn't add anything to this group.
            return groups.concat([[step.id], []]);
          },
          [[]] as StepId[][]
        )
        .filter((group) => group.length > 0),
    [activeSteps]
  );
  const activeStepId = location.hash.substring(1) as StepId;
  const activeStepIdx = activeSteps.findIndex(
    (step) => step.id === activeStepId
  );
  const expandedGroupIdx = useMemo(
    () => groups.findIndex((group) => group.includes(activeStepId)),
    [activeStepId, groups]
  );
  const setActiveStepId = (stepId: StepId | undefined) =>
    history.push(stepId != null ? `#${stepId}` : "#");
  return (
    <Stepper nonLinear orientation="vertical" activeStep={activeStepIdx}>
      {groups.map((group, groupIdx) => {
        const correctedIdx = groups
          .slice(0, groupIdx)
          .reduce((sum, group) => sum + group.length, 0);
        if (groupIdx !== expandedGroupIdx && group.length > 1) {
          return (
            <Step
              key={`multi_${groupIdx}`}
              index={correctedIdx}
              completed={group.every((stepId) =>
                completedSteps.includes(stepId)
              )}
            >
              <StepButton
                icon={"\u00B7\u00B7\u00B7"}
                onClick={() => setActiveStepId(group[0])}
              >
                <Typography variant="caption">
                  {React.Children.toArray(
                    group.slice(0, 2).map((stepId, index) => (
                      <>
                        {index > 0 && ", "}
                        <StepLabel stepId={stepId} />
                      </>
                    ))
                  )}
                  {group.length > 2 && `, and ${group.length - 2} more...`}
                </Typography>
              </StepButton>
            </Step>
          );
        }
        return group.map((stepId, idx) => (
          <Step
            key={stepId}
            id={stepId}
            index={correctedIdx + idx}
            completed={completedSteps.includes(stepId)}
          >
            <StepButton
              onClick={
                correctedIdx + idx !== activeStepIdx
                  ? () => setActiveStepId(stepId)
                  : undefined
              }
            >
              <StepLabel stepId={stepId} />
            </StepButton>
            <StepContent>
              <InstanceItemContent stepId={stepId} />
              <Button
                sx={{ marginBlockStart: 10 }}
                variant="contained"
                color="primary"
                onClick={() => {
                  setCompletedSteps((steps) =>
                    steps.includes(stepId) ? steps : [...steps, stepId]
                  );
                  const nextStepId = activeSteps.find(
                    (x) => !completedSteps.includes(x.id) && x.id !== stepId
                  )?.id;
                  setActiveStepId(nextStepId);
                }}
              >
                Done
              </Button>
            </StepContent>
          </Step>
        ));
      })}
    </Stepper>
  );
}
