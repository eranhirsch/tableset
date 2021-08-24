import {
  Avatar,
  AvatarGroup,
  Badge,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Typography,
} from "@material-ui/core";
import { EntityId } from "@reduxjs/toolkit";
import { useAppSelector } from "../../app/hooks";
import nullthrows from "../../common/err/nullthrows";
import { useAppEntityIdSelectorEnforce } from "../../common/hooks/useAppEntityIdSelector";
import PlayerColors from "../../common/PlayerColors";
import short_name from "../../common/short_name";
import ConcordiaGame, {
  SetupStepName,
} from "../../games/concordia/ConcordiaGame";
import { stepLabel } from "../../games/concordia/content";
import { selectors as playersSelectors } from "../players/playersSlice";
import { selectors as instanceSelectors } from "./instanceSlice";

function PlayOrderPanel({ playOrder }: { playOrder: ReadonlyArray<EntityId> }) {
  const players = useAppSelector(playersSelectors.selectEntities);

  return (
    <AvatarGroup>
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
          paddingX: 2,
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
