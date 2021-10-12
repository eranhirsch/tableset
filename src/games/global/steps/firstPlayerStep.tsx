import {
  Avatar,
  Badge,
  Checkbox,
  FormControlLabel,
  Stack,
  Typography,
} from "@mui/material";
import { C, Vec } from "common";
import { PlayerNameShortAbbreviation } from "features/players/PlayerNameShortAbbreviation";
import { ConfigPanelProps } from "features/template/Templatable";
import { templateValue } from "features/template/templateSlice";
import { playersMetaStep } from "games/core/steps/createPlayersDependencyMetaStep";
import { Query } from "games/core/steps/Query";
import React, { useMemo } from "react";
import { PlayerAvatar } from "../../../features/players/PlayerAvatar";
import { PlayerId } from "../../../model/Player";
import {
  createRandomGameStep,
  VariableStepInstanceComponentProps,
} from "../../core/steps/createRandomGameStep";

type TemplateConfig = { random: true } | { fixed: PlayerId };

export default createRandomGameStep({
  id: "firstPlayer",

  dependencies: [playersMetaStep],

  isType: (x): x is PlayerId => typeof x === "string",

  InstanceVariableComponent,
  InstanceManualComponent: "Choose which player goes first.",

  isTemplatable: (players) =>
    players.count({
      // Solo games don't need a first player
      min: 2,
    }),
  resolve: (config, playerIds) =>
    "fixed" in config ? config.fixed : Vec.sample(playerIds!, 1),
  initialConfig: (players) => ({ fixed: defaultFirstPlayer(players) }),
  refresh: (current, players) =>
    templateValue(
      "fixed" in current && !players.resolve().includes(current.fixed)
        ? "unfixable"
        : "unchanged"
    ),

  ConfigPanel,
});

const defaultFirstPlayer = (players: Query<readonly PlayerId[]>): PlayerId =>
  C.firstx(players.resolve());

function ConfigPanel({
  config,
  queries: [players],
  onChange,
}: ConfigPanelProps<TemplateConfig, readonly PlayerId[]>): JSX.Element {
  const initialFixed = useMemo(() => defaultFirstPlayer(players), [players]);
  return (
    <Stack direction="column" spacing={1} alignItems="center">
      <FixedSelector
        playerIds={players.resolve()}
        currentFirstId={
          config != null && "fixed" in config ? config.fixed : initialFixed
        }
        disabled={config == null || "random" in config}
        onChange={(newOrder) => onChange({ fixed: newOrder })}
      />
      <FormControlLabel
        sx={{ alignSelf: "center" }}
        control={
          <Checkbox
            checked={config != null && "random" in config}
            onChange={(_, checked) =>
              onChange(checked ? { random: true } : { fixed: initialFixed })
            }
          />
        }
        label="Random"
      />
    </Stack>
  );
}

function FixedSelector({
  currentFirstId,
  playerIds,
  disabled,
  onChange,
}: {
  currentFirstId: PlayerId;
  playerIds: readonly PlayerId[];
  disabled: boolean;
  onChange(newPlayerId: PlayerId): void;
}) {
  return (
    <Stack direction="row" sx={{ opacity: disabled ? 0.5 : 1.0 }}>
      {React.Children.toArray(
        Vec.map(playerIds, (playerId) => (
          <SelectorPlayer
            playerId={playerId}
            isSelected={playerId === currentFirstId}
            disabled={disabled}
            onChange={onChange}
          />
        ))
      )}
    </Stack>
  );
}

function SelectorPlayer({
  playerId,
  isSelected,
  onChange,
  disabled,
}: {
  playerId: PlayerId;
  isSelected: boolean;
  onChange(newPlayerId: PlayerId): void;
  disabled: boolean;
}): JSX.Element | null {
  return (
    <Badge
      color="primary"
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      overlap="circular"
      badgeContent={isSelected ? "1" : undefined}
    >
      <Avatar
        sx={{ margin: 0.5 }}
        onClick={!isSelected ? () => onChange(playerId) : undefined}
      >
        <PlayerNameShortAbbreviation playerId={playerId} />
      </Avatar>
    </Badge>
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

// function TemplateLabel({ value }: { value: PlayerId }): JSX.Element {
//   return <PlayerShortName playerId={value} />;
// }
