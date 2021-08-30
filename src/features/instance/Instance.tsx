import {
  Avatar,
  AvatarGroup,
  Badge,
  Box,
  Button,
  Stack,
  Step,
  StepButton,
  StepContent,
  Stepper,
  Typography,
} from "@material-ui/core";
import { EntityId } from "@reduxjs/toolkit";
import { useMemo, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import nullthrows from "../../common/err/nullthrows";
import {
  useAppEntityIdSelectorEnforce,
  useAppEntityIdSelectorNullable,
} from "../../common/hooks/useAppEntityIdSelector";
import PlayerColors from "../../common/PlayerColors";
import short_name from "../../common/short_name";
import {
  firstPlayerSelector,
  selectors as playersSelectors,
} from "../players/playersSlice";
import { MarketDisplayFixedInstructions } from "../../games/concordia/ux/MarketDisplayFixedInstructions";
import { selectors as instanceSelectors } from "./instanceSlice";
import { CityTilesFixedInstructions } from "../../games/concordia/ux/CityTilesFixedInstructions";
import { gameSelector } from "../game/gameSlice";
import { StepId } from "../../games/Game";

const IDEAL_STEP_COUNT = 6;

function PlayOrderPanel({ playOrder }: { playOrder: ReadonlyArray<EntityId> }) {
  const firstPlayer = useAppSelector(firstPlayerSelector);
  const players = useAppSelector(playersSelectors.selectEntities);

  return (
    <Box display="flex">
      <AvatarGroup>
        <Avatar>{short_name(firstPlayer.name)}</Avatar>
        {playOrder.map((playerId) => (
          <Avatar key={playerId}>
            {short_name(nullthrows(players[playerId]).name)}
          </Avatar>
        ))}
      </AvatarGroup>
    </Box>
  );
}

function PlayerColorsPanel({ playerColor }: { playerColor: PlayerColors }) {
  const players = useAppSelector(playersSelectors.selectEntities);

  return (
    <Stack direction="row" spacing={1}>
      {Object.entries(playerColor).map(([playerId, color]) => (
        <Badge
          key={playerId}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          overlap="circular"
          invisible={false}
          color={color}
        >
          <Avatar>{short_name(nullthrows(players[playerId]).name)}</Avatar>
        </Badge>
      ))}
    </Stack>
  );
}

function FirstPlayerPanel({ playerId }: { playerId: EntityId }) {
  const player = useAppEntityIdSelectorEnforce(playersSelectors, playerId);

  return <Avatar>{short_name(player.name)}</Avatar>;
}

function InstanceItemContent({ stepId }: { stepId: StepId }) {
  const step = useAppEntityIdSelectorNullable(instanceSelectors, stepId);
  const game = useAppSelector(gameSelector);

  if (step == null) {
    return null;
  }

  if (step.global) {
    switch (step.id) {
      case "playOrder":
        return <PlayOrderPanel playOrder={step.value} />;

      case "playerColors":
        return <PlayerColorsPanel playerColor={step.value} />;

      case "firstPlayer":
        return <FirstPlayerPanel playerId={step.value} />;
    }
  } else {
    // TODO: Move this to a game specific parser
    switch (step.id) {
      case "map":
        return (
          <Typography variant="h4" sx={{ fontVariantCaps: "petite-caps" }}>
            {game.labelForItem("map", step.value)}
          </Typography>
        );

      case "cityTiles":
        return <CityTilesFixedInstructions hash={step.value} />;

      case "marketDisplay":
        return <MarketDisplayFixedInstructions hash={step.value} />;

      default:
        return <Typography variant="h4">{step.value}</Typography>;
    }
  }
}

export default function Instance() {
  const location = useLocation();
  const history = useHistory();

  const game = useAppSelector(gameSelector);

  const [completedSteps, setCompletedSteps] = useState<readonly StepId[]>([]);

  const instanceStepIds = useAppSelector(instanceSelectors.selectIds);

  const groups = useMemo(() => {
    const nonManualSteps = [...instanceStepIds];
    return game.order.reduce(
      (groups: StepId[][], stepId, index) => {
        let lastGroup = groups[groups.length - 1];

        const manualStepIdx = nonManualSteps.indexOf(stepId);
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

          lastGroup.push(stepId);
          // We push an additional group after the step so that the next
          // next iterations dont add anything to this group.
          groups.push([]);
          return groups;
        }

        // We want to spread the steps that aren't special into the remaining
        // slots they have as fairly as possible
        const manualStepsLeft =
          game.order.length - index - nonManualSteps.length;
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
        lastGroup.push(stepId);

        return groups;
      },
      [[]]
    );
  }, [game.order, instanceStepIds]);

  const activeStepId = location.hash.substring(1) as StepId;
  const activeStepIdx = game.order.indexOf(activeStepId);

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
                    .map((stepId) => game.stepLabel(stepId))
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
              {game.stepLabel(stepId)}
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
                  const nextStepId = game.order.find(
                    (x) => !completedSteps.includes(x) && x !== stepId
                  );
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
