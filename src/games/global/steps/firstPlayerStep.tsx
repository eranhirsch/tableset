import { Typography } from "@mui/material";
import { C, Vec } from "common";
import { ConfigPanelProps } from "features/template/Templatable";
import { templateValue } from "features/template/templateSlice";
import { playersMetaStep } from "games/core/steps/createPlayersDependencyMetaStep";
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
  initialConfig: (players) => ({ fixed: C.firstx(players.resolve()) }),
  refresh: (current, players) =>
    templateValue(
      "fixed" in current && !players.resolve().includes(current.fixed)
        ? "unfixable"
        : "unchanged"
    ),

  ConfigPanel,
});

function ConfigPanel({
  config,
  queries,
  onChange,
}: ConfigPanelProps<TemplateConfig, readonly PlayerId[]>): JSX.Element {
  return <div>Hello World</div>;
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

// function Selector() {
//   const playerIds = useAppSelector(playersSelectors.selectIds) as PlayerId[];

//   const step = ReactUtils.useAppEntityIdSelectorEnforce(
//     templateSelectors,
//     "firstPlayer"
//   );
//   const selectedPlayerId = step.config as PlayerId;

//   return (
//     <Stack component="ul" direction="row" pl={0} sx={{ listStyle: "none" }}>
//       {playerIds.map((playerId) => (
//         <SelectorPlayer
//           key={playerId}
//           playerId={playerId}
//           isSelected={playerId === selectedPlayerId}
//         />
//       ))}
//     </Stack>
//   );
// }

// function SelectorPlayer({
//   playerId,
//   isSelected,
// }: {
//   playerId: PlayerId;
//   isSelected: boolean;
// }): JSX.Element | null {
//   return (
//     <Badge
//       color="primary"
//       anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
//       overlap="circular"
//       badgeContent={isSelected ? "1" : undefined}
//     >
//       <Avatar
//         sx={{ margin: 0.5 }}
//         // TODO: Modernize this to use the new ConfigPanel
//         // onClick={
//         //   !isSelected
//         //     ? () =>
//         //         dispatch(
//         //           templateActions.constantValueChanged({
//         //             id: "firstPlayer",
//         //             value: playerId,
//         //           })
//         //         )
//         //     : undefined
//         // }
//       >
//         <PlayerNameShortAbbreviation playerId={playerId} />
//       </Avatar>
//     </Badge>
//   );
// }
