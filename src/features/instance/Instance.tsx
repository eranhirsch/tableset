import {
  Button,
  Step,
  StepButton,
  StepContent,
  Stepper,
  Typography,
} from "@material-ui/core";
import { useMemo, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import array_filter_nulls from "../../common/lib_utils/array_filter_nulls";
import { StepId } from "../../games/core/IGame";
import { gameSelector } from "../game/gameSlice";
import { PlayerId, playersSelectors } from "../players/playersSlice";
import { instanceSelectors } from "./instanceSlice";

function InstanceItemContent({
  stepId,
}: {
  stepId: StepId;
}): JSX.Element | null {
  const game = useAppSelector(gameSelector);
  const instance = useAppSelector(instanceSelectors.selectEntities);
  const playerIds = useAppSelector(playersSelectors.selectIds) as PlayerId[];

  const gameStep = game.atEnforce(stepId);

  const {
    InstanceVariableComponent,
    InstanceDerivedComponent,
    InstanceManualComponent,
  } = gameStep;

  if (InstanceVariableComponent != null) {
    const instanceStep = instance[stepId];
    if (instanceStep != null) {
      return <InstanceVariableComponent value={instanceStep.value} />;
    }
  } else if (InstanceDerivedComponent != null) {
    return (
      <InstanceDerivedComponent
        context={{
          instance: array_filter_nulls(Object.values(instance)),
          playerIds,
        }}
      />
    );
  }

  if (InstanceManualComponent != null) {
    return <InstanceManualComponent />;
  }

  // TODO: Kill this, make InstanceManualComponent non nullable
  return <div>Manual Section</div>;
}

export default function Instance(): JSX.Element | null {
  const location = useLocation();
  const history = useHistory();

  const game = useAppSelector(gameSelector);

  const [completedSteps, setCompletedSteps] = useState<readonly StepId[]>([]);

  const groups = useMemo(
    () =>
      game.steps
        .reduce(
          (
            groups: StepId[][],
            { id, InstanceDerivedComponent, InstanceVariableComponent },
            index
          ) => {
            if (
              InstanceDerivedComponent == null &&
              InstanceVariableComponent == null
            ) {
              // Trivial steps dont have any special component rendering defined,
              // they will ALWAYS render exactly the same, so we group them to
              // make it easier to skip them
              groups[groups.length - 1].push(id);
              return groups;
            }

            // We need to create a new group for each non-manual step and
            // push an additional group after the step so that the next
            // iterations' doesnt add anything to this group.
            return groups.concat([[id], []]);
          },
          [[]]
        )
        .filter((group) => group.length > 0),
    [game.steps]
  );

  const activeStepId = location.hash.substring(1) as StepId;
  const activeStepIdx = game.steps.findIndex(
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
                  {`${group
                    .slice(0, 2)
                    .map((stepId) => game.atEnforce(stepId).label)
                    .join(", ")}${
                    group.length > 2 ? `, and ${group.length - 1} more...` : ""
                  }`}
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
              {game.atEnforce(stepId).label}
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
                  const nextStepId = game.steps.find(
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
