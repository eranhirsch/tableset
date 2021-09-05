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
import { instanceSelectors } from "./instanceSlice";
import { gameSelector } from "../game/gameSlice";
import nullthrows from "../../common/err/nullthrows";
import { StepId } from "../../games/core/IGame";
import { PlayerId, playersSelectors } from "../players/playersSlice";
import filter_nulls from "../../common/lib_utils/filter_nulls";

const IDEAL_STEP_COUNT = 6;

function InstanceItemContent({
  stepId,
}: {
  stepId: StepId;
}): JSX.Element | null {
  const game = useAppSelector(gameSelector);
  const instance = useAppSelector(instanceSelectors.selectEntities);
  const playerIds = useAppSelector(playersSelectors.selectIds) as PlayerId[];

  const gameStep = nullthrows(
    game.at(stepId),
    `Step ${stepId} missing in game`
  );

  if (gameStep.renderVariableInstanceContent != null) {
    const instanceStep = instance[stepId];
    if (instanceStep != null) {
      return gameStep.renderVariableInstanceContent(instanceStep.value);
    }
  } else if (gameStep.renderDerivedInstanceContent != null) {
    const renderedContent = gameStep.renderDerivedInstanceContent({
      instance: filter_nulls(Object.values(instance)),
      playerIds,
    });
    if (renderedContent != null) {
      return renderedContent;
    }
  }

  return <div>Manual Section</div>;
}

export default function Instance(): JSX.Element | null {
  const location = useLocation();
  const history = useHistory();

  const game = useAppSelector(gameSelector);

  const [completedSteps, setCompletedSteps] = useState<readonly StepId[]>([]);

  const instanceStepIds = useAppSelector(instanceSelectors.selectIds);

  const groups = useMemo(() => {
    const nonManualSteps = [...instanceStepIds];
    return game.steps.reduce(
      (groups: StepId[][], step, index) => {
        let lastGroup = groups[groups.length - 1];

        const manualStepIdx = nonManualSteps.indexOf(step.id);
        if (manualStepIdx !== -1) {
          // We have something to show for this step, so we want to put it in
          // it's own group.

          // We want to keep a count of how many of these we are going to
          // encounter so we can account for them when putting manual items in
          // groups
          nonManualSteps.splice(manualStepIdx, 1);

          if (lastGroup.length > 0) {
            // We need to create a new group for each non-manual step
            lastGroup = [];
            groups.push(lastGroup);
          }

          lastGroup.push(step.id);
          // We push an additional group after the step so that the next
          // next iterations dont add anything to this group.
          groups.push([]);
          return groups;
        }

        // We want to spread the steps that aren't special into the remaining
        // slots they have as fairly as possible
        const manualStepsLeft =
          game.steps.length - index - nonManualSteps.length;
        const manualStepGroupsLeft =
          IDEAL_STEP_COUNT - (groups.length - 1) - nonManualSteps.length;

        if (
          // Dont create a new group if we don't have any left
          manualStepGroupsLeft > 1 &&
          // Obviously always add at least 1 item to each group
          lastGroup.length > 0 &&
          lastGroup.length >= Math.round(manualStepsLeft / manualStepGroupsLeft)
        ) {
          // Create a new group
          lastGroup = [];
          groups.push(lastGroup);
        }
        lastGroup.push(step.id);

        return groups;
      },
      [[]]
    );
  }, [game.steps, instanceStepIds]);

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
                    .map((stepId) => game.at(stepId)!.label)
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
              {game.at(stepId)!.label}
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
