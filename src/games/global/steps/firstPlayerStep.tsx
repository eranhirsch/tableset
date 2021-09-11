import { Typography } from "@material-ui/core";
import { PlayerId } from "../../../features/players/playersSlice";
import createPlayersDependencyMetaStep from "../../core/steps/createPlayersDependencyMetaStep";
import createVariableGameStep, {
  VariableStepInstanceComponentProps,
} from "../../core/steps/createVariableGameStep";
import FirstPlayerFixedTemplateLabel from "../ux/FirstPlayerFixedTemplateLabel";
import Player from "../ux/Player";
import StartingPlayerPanel from "../ux/StartingPlayerPanel";

export default createVariableGameStep({
  id: "firstPlayer",

  dependencies: [
    // Solo games don't need a first player
    createPlayersDependencyMetaStep({ min: 2 }),
  ],

  isType: (x): x is PlayerId => typeof x === "string",

  InstanceVariableComponent,
  InstanceManualComponent: "Choose which player goes first.",

  random: (playerIds) =>
    playerIds[Math.floor(Math.random() * playerIds.length)],

  fixed: {
    renderSelector: StartingPlayerPanel,
    renderTemplateLabel: FirstPlayerFixedTemplateLabel,
    initializer(playerIds) {
      if (playerIds.length < 2) {
        // meaningless
        return;
      }

      return playerIds[0];
    },

    refresh: (current, playerIds) =>
      playerIds.includes(current) ? current : undefined,
  },
});

function InstanceVariableComponent({
  value: playerId,
}: VariableStepInstanceComponentProps<PlayerId>): JSX.Element {
  return (
    <>
      <Typography variant="body1">
        The first player to play a turn would be:
      </Typography>
      <figure>
        <Player playerId={playerId} />
      </figure>
    </>
  );
}
