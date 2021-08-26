import {
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Link,
  Stack,
  Step,
  StepButton,
  StepContent,
  StepIcon,
  StepLabel,
  Stepper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@material-ui/core";
import { EntityId } from "@reduxjs/toolkit";
import React, { useMemo, useState } from "react";
import {
  Route,
  Switch,
  useHistory,
  useParams,
  useRouteMatch,
} from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import invariant_violation from "../../common/err/invariant_violation";
import nullthrows from "../../common/err/nullthrows";
import {
  useAppEntityIdSelectorEnforce,
  useAppEntityIdSelectorNullable,
} from "../../common/hooks/useAppEntityIdSelector";
import PlayerColors from "../../common/PlayerColors";
import short_name from "../../common/short_name";
import ConcordiaGame, {
  SetupStepName,
} from "../../games/concordia/ConcordiaGame";
import { stepLabel } from "../../games/concordia/content";
import {
  firstPlayerSelector,
  selectors as playersSelectors,
} from "../players/playersSlice";
import { selectors as instanceSelectors } from "./instanceSlice";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import UnfoldLessIcon from "@material-ui/icons/UnfoldLess";
import UnfoldMoreIcon from "@material-ui/icons/UnfoldMore";

const IDEAL_STEP_COUNT = 6;

function ConcordiaMarket({ hash }: { hash: string }) {
  const market = ConcordiaGame.getMarketForHash(hash);
  return (
    <Stack direction="column" alignItems="center">
      <TableContainer>
        <Table size="small">
          <TableBody>
            {market.map((cardName) => (
              <TableRow key={cardName}>
                <TableCell>
                  <Typography variant="body2">{cardName}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography variant="caption">Hash: {hash}</Typography>
    </Stack>
  );
}

function ConcordiaCityTiles({ hash }: { hash: string }) {
  const mapStep = useAppEntityIdSelectorEnforce(instanceSelectors, "map");
  if (mapStep.id !== "map") {
    invariant_violation();
  }
  const mapId = mapStep.value;

  const cities = Object.entries(ConcordiaGame.cityResources(mapId, hash));

  const middle = Math.floor(cities.length / 2 - 1) + 1;

  return (
    <Stack direction="column" alignItems="center">
      <Stack direction="row">
        <TableContainer>
          <Table size="small">
            <TableBody>
              {cities.slice(0, middle).map(([city, resource]) => (
                <TableRow key={city}>
                  <TableCell>
                    <Typography fontSize="small" variant="body2">
                      {city}
                    </Typography>
                  </TableCell>
                  <TableCell>{resource}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TableContainer>
          <Table size="small">
            <TableBody>
              {cities.slice(middle).map(([city, resource]) => (
                <TableRow key={city}>
                  <TableCell>
                    <Typography fontSize="small" variant="body2">
                      {city}
                    </Typography>
                  </TableCell>
                  <TableCell>{resource}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
      <Typography variant="caption">Hash: {hash}</Typography>
    </Stack>
  );
}

function PlayOrderPanel({ playOrder }: { playOrder: ReadonlyArray<EntityId> }) {
  const firstPlayer = useAppSelector(firstPlayerSelector);
  const players = useAppSelector(playersSelectors.selectEntities);

  return (
    <AvatarGroup>
      <Avatar>{short_name(firstPlayer.name)}</Avatar>
      {playOrder.map((playerId) => (
        <Avatar key={playerId}>
          {short_name(nullthrows(players[playerId]).name)}
        </Avatar>
      ))}
    </AvatarGroup>
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

function InstanceItemContent({ stepId }: { stepId: SetupStepName }) {
  const step = useAppEntityIdSelectorEnforce(instanceSelectors, stepId);

  switch (step.id) {
    case "playOrder":
      return <PlayOrderPanel playOrder={step.value} />;

    case "playerColors":
      return <PlayerColorsPanel playerColor={step.value} />;

    case "firstPlayer":
      return <FirstPlayerPanel playerId={step.value} />;

    case "cityTiles":
      return <ConcordiaCityTiles hash={step.value} />;

    case "marketDisplay":
      return <ConcordiaMarket hash={step.value} />;

    default:
      return <Typography variant="h4">{step.value}</Typography>;
  }
}

function InstanceItem({ stepId }: { stepId: SetupStepName }) {
  const match = useRouteMatch();
  const history = useHistory();

  const label = stepLabel(stepId);

  return (
    <Card
      component="li"
      onClick={() => history.push(`${match.path}/${stepId}/`)}
    >
      <CardHeader avatar={<Avatar>{short_name(label)}</Avatar>} title={label} />
      <CardContent
        sx={{
          justifyContent: "center",
          display: "flex",
          paddingX: 1,
        }}
      >
        <InstanceItemContent stepId={stepId} />
      </CardContent>
    </Card>
  );
}

function InstanceOverviewStep({ stepId }: { stepId: SetupStepName }) {
  const step = useAppEntityIdSelectorNullable(instanceSelectors, stepId);

  if (step == null) {
    return null;
  }

  switch (step?.id) {
    case "playOrder":
      return (
        <StepContent sx={{ display: "flex" }}>
          <PlayOrderPanel playOrder={step.value} />
        </StepContent>
      );

    case "playerColors":
      return (
        <StepContent>
          <PlayerColorsPanel playerColor={step.value} />
        </StepContent>
      );

    case "firstPlayer":
      return (
        <StepContent>
          <FirstPlayerPanel playerId={step.value} />
        </StepContent>
      );

    default:
      return <StepContent>{step.value}</StepContent>;
  }
}

function InstanceOverview() {
  const history = useHistory();
  const match = useRouteMatch();

  const [expandedGroupIdx, setExpandedGroupIdx] = useState<number>();

  const instanceStepIds = useAppSelector(instanceSelectors.selectIds);

  const groups = useMemo(() => {
    const nonManualSteps = [...instanceStepIds];
    return ConcordiaGame.order.reduce(
      (groups: SetupStepName[][], stepId, index) => {
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
          ConcordiaGame.order.length - index - nonManualSteps.length;
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
  }, [instanceStepIds]);

  return (
    <Stepper orientation="vertical" activeStep={-1}>
      {groups.map((group, groupIdx) => {
        const correctedIdx = groups
          .slice(0, groupIdx)
          .reduce((sum, group) => sum + group.length, 0);
        if (groupIdx !== expandedGroupIdx && group.length > 1) {
          return (
            <Step key={`multi_${groupIdx}`} index={correctedIdx} expanded>
              <StepLabel icon={"\u00B7\u00B7\u00B7"}>
                {`${group
                  .slice(0, 2)
                  .map((stepId) => stepLabel(stepId))
                  .join(", ")}${
                  group.length > 2 ? `, and ${group.length - 1} more...` : ""
                }`}
                <IconButton
                  size="small"
                  onClick={() => setExpandedGroupIdx(groupIdx)}
                >
                  <UnfoldMoreIcon fontSize="small" />
                </IconButton>
              </StepLabel>
            </Step>
          );
        }

        return group.map((stepId, idx) => (
          <Step
            key={stepId}
            onClick={() => history.push(`${match.path}/${stepId}`)}
            index={correctedIdx + idx}
            expanded
          >
            <StepLabel>
              {stepLabel(stepId)}
              {groupIdx === expandedGroupIdx && (
                <IconButton
                  size="small"
                  onClick={(event) => {
                    setExpandedGroupIdx(undefined);
                    event.stopPropagation();
                  }}
                >
                  <UnfoldLessIcon fontSize="small" />
                </IconButton>
              )}
            </StepLabel>
            <InstanceOverviewStep key={stepId} stepId={stepId} />
          </Step>
        ));
      })}
    </Stepper>
  );
}

function InstanceStep() {
  let { stepId } = useParams<{ stepId: SetupStepName }>();
  return <InstanceItemContent stepId={stepId} />;
}

export default function Instance() {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route path={`${match.path}/:stepId`}>
        <InstanceStep />
      </Route>
      <Route path={`${match.path}`}>
        <InstanceOverview />
      </Route>
    </Switch>
  );
}
