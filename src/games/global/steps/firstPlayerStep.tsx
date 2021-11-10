import { Avatar, Badge, Stack, Typography } from "@mui/material";
import { Random, Vec } from "common";
import { PlayerNameShortAbbreviation } from "features/players/PlayerNameShortAbbreviation";
import { PlayerShortName } from "features/players/PlayerShortName";
import { ConfigPanelProps } from "features/template/Templatable";
import { templateValue } from "features/template/templateSlice";
import React from "react";
import { PlayerAvatar } from "../../../features/players/PlayerAvatar";
import { PlayerId } from "../../../model/Player";
import {
  createRandomGameStep,
  VariableStepInstanceComponentProps,
} from "../../core/steps/createRandomGameStep";
import playersMetaStep from "./playersMetaStep";

type TemplateConfig = { playerId?: PlayerId };

export default createRandomGameStep({
  id: "firstPlayer",

  dependencies: [playersMetaStep],

  isType: (x): x is PlayerId => typeof x === "string",

  InstanceVariableComponent,
  InstanceManualComponent: "Choose which player goes first.",

  isTemplatable: (players) =>
    players.willContainNumElements({
      // Solo games don't need a first player
      min: 2,
    }),
  resolve: ({ playerId }, playerIds) =>
    playerId ?? Random.sample(playerIds!, 1),
  onlyResolvableValue: (config) => config?.playerId,
  initialConfig: (): TemplateConfig => ({}),
  refresh: ({ playerId }, players) =>
    templateValue(
      playerId != null && !players.onlyResolvableValue()!.includes(playerId)
        ? "unfixable"
        : "unchanged"
    ),

  ConfigPanel,
  ConfigPanelTLDR,
});

function ConfigPanel({
  config: { playerId: firstPlayerId },
  queries: [players],
  onChange,
}: ConfigPanelProps<TemplateConfig, readonly PlayerId[]>): JSX.Element {
  return (
    <Stack direction="row" justifyContent="center" paddingY={1}>
      {React.Children.toArray(
        Vec.map(players.onlyResolvableValue()!, (playerId) => (
          <Badge
            color="primary"
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            overlap="circular"
            badgeContent={playerId === firstPlayerId ? "1" : undefined}
          >
            <Avatar
              sx={{ margin: 0.5 }}
              onClick={() =>
                onChange(({ playerId: currentFirstPlayerId }) =>
                  currentFirstPlayerId === playerId ? {} : { playerId }
                )
              }
            >
              <PlayerNameShortAbbreviation playerId={playerId} />
            </Avatar>
          </Badge>
        ))
      )}
    </Stack>
  );
}

function InstanceVariableComponent({
  value: playerId,
}: VariableStepInstanceComponentProps<PlayerId>): JSX.Element {
  return (
    <Typography variant="body1">
      <PlayerAvatar playerId={playerId} inline /> will play first.
    </Typography>
  );
}

function ConfigPanelTLDR({
  config: { playerId },
}: {
  config: Readonly<TemplateConfig>;
}): JSX.Element {
  return playerId == null ? (
    <>Random</>
  ) : (
    <PlayerShortName playerId={playerId} />
  );
}
