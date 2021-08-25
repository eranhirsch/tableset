import {
  Avatar,
  AvatarGroup,
  Badge,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Step,
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
import React from "react";
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
import { useAppEntityIdSelectorEnforce } from "../../common/hooks/useAppEntityIdSelector";
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
      <Avatar key="firstPlayer">{short_name(firstPlayer.name)}</Avatar>
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

function InstanceOverview() {
  return (
    <Stepper orientation="vertical">
      {ConcordiaGame.order.map((stepId) => (
        <Step key={stepId}>
          <StepLabel>{stepLabel(stepId)}</StepLabel>
        </Step>
      ))}
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
