import { Avatar, Badge, Stack, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { invariant_violation, Random, ReactUtils } from "common";
import { playersSelectors } from "features/players/playersSlice";
import { Strategy } from "features/template/Strategy";
import {
  templateActions,
  templateSelectors,
  templateValue,
} from "features/template/templateSlice";
import { playersMetaStep } from "games/core/steps/createPlayersDependencyMetaStep";
import { PlayerAvatar } from "../../../features/players/PlayerAvatar";
import { PlayerNameShortAbbreviation } from "../../../features/players/PlayerNameShortAbbreviation";
import { PlayerShortName } from "../../../features/players/PlayerShortName";
import { PlayerId } from "../../../model/Player";
import {
  createRandomGameStep,
  VariableStepInstanceComponentProps,
} from "../../core/steps/createRandomGameStep";

export default createRandomGameStep({
  id: "firstPlayer",

  dependencies: [playersMetaStep],

  isType: (x): x is PlayerId => typeof x === "string",

  InstanceVariableComponent,
  InstanceManualComponent: "Choose which player goes first.",

  random: (playerIds) => playerIds[Random.index(playerIds)],

  fixed: {
    renderSelector: Selector,
    renderTemplateLabel: TemplateLabel,
    initializer(playerIds) {
      if (playerIds.length < 2) {
        // meaningless
        return;
      }

      return playerIds[0];
    },
  },

  isTemplatable: (players) =>
    players.count({
      // Solo games don't need a first player
      min: 2,
    }),
  refresh: (current, players) =>
    templateValue(
      players.resolve().includes(current) ? "unchanged" : "unfixable"
    ),
});

function InstanceVariableComponent({
  value: playerId,
}: VariableStepInstanceComponentProps<PlayerId>): JSX.Element {
  return (
    <Typography variant="body1">
      <PlayerAvatar playerId={playerId} inline /> will play first.
    </Typography>
  );
}

function TemplateLabel({ value }: { value: PlayerId }): JSX.Element {
  return <PlayerShortName playerId={value} />;
}

function Selector() {
  const playerIds = useAppSelector(playersSelectors.selectIds) as PlayerId[];

  const step = ReactUtils.useAppEntityIdSelectorEnforce(
    templateSelectors,
    "firstPlayer"
  );
  if (step.id !== "firstPlayer" || step.strategy !== Strategy.FIXED) {
    invariant_violation(`Step ${step} is misconfigured for this panel`);
  }
  const selectedPlayerId = step.value;

  return (
    <Stack component="ul" direction="row" pl={0} sx={{ listStyle: "none" }}>
      {playerIds.map((playerId) => (
        <SelectorPlayer
          key={playerId}
          playerId={playerId}
          isSelected={playerId === selectedPlayerId}
        />
      ))}
    </Stack>
  );
}

function SelectorPlayer({
  playerId,
  isSelected,
}: {
  playerId: PlayerId;
  isSelected: boolean;
}): JSX.Element | null {
  const dispatch = useAppDispatch();

  return (
    <Badge
      color="primary"
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      overlap="circular"
      badgeContent={isSelected ? "1" : undefined}
    >
      <Avatar
        sx={{ margin: 0.5 }}
        onClick={
          !isSelected
            ? () =>
                dispatch(
                  templateActions.constantValueChanged({
                    id: "firstPlayer",
                    value: playerId,
                  })
                )
            : undefined
        }
      >
        <PlayerNameShortAbbreviation playerId={playerId} />
      </Avatar>
    </Badge>
  );
}
