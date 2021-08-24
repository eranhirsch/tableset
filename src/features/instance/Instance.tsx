import {
  Avatar,
  AvatarGroup,
  Badge,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@material-ui/core";
import { EntityId } from "@reduxjs/toolkit";
import React from "react";
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

function ConcordiaCityTiles({ hash }: { hash: string }) {
  const mapStep = useAppEntityIdSelectorEnforce(instanceSelectors, "map");
  if (mapStep.id !== "map") {
    invariant_violation();
  }
  const mapId = mapStep.value;

  const cities = Object.entries(ConcordiaGame.cityResources(mapId, hash));

  return (
    <Stack direction="column" alignItems="center">
      <Stack direction="row">
        <TableContainer>
          <Table size="small">
            <TableBody>
              {cities
                .slice(0, Math.floor(cities.length / 2) + 1)
                .map(([city, resource]) => (
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
              {cities
                .slice(Math.floor(cities.length / 2) + 1)
                .map(([city, resource]) => (
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

    default:
      return <Typography variant="h4">{step.value}</Typography>;
  }
}

function InstanceItem({ stepId }: { stepId: SetupStepName }) {
  const label = stepLabel(stepId);
  return (
    <Card component="li">
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

export default function Instance() {
  const stepIds = useAppSelector(instanceSelectors.selectIds);

  return (
    <Stack
      component="ol"
      sx={{ listStyle: "none", paddingInlineStart: 0 }}
      direction="column"
      spacing={1}
    >
      {ConcordiaGame.order
        .filter((stepId) => stepIds.includes(stepId))
        .map((stepId) => (
          <InstanceItem key={stepId} stepId={stepId as SetupStepName} />
        ))}
    </Stack>
  );
}
