import { PlayerId } from "../../../features/players/playersSlice";
import createPlayersDependencyMetaStep from "../../core/steps/createPlayersDependencyMetaStep";
import createVariableGameStep from "../../core/steps/createVariableGameStep";
import FirstPlayerFixedTemplateLabel from "../ux/FirstPlayerFixedTemplateLabel";
import FirstPlayerPanel from "../ux/FirstPlayerPanel";
import StartingPlayerPanel from "../ux/StartingPlayerPanel";

export default createVariableGameStep({
  id: "firstPlayer",

  dependencies: [
    // Solo games don't need a first player
    createPlayersDependencyMetaStep({ min: 2 }),
  ],

  isType: (x): x is PlayerId => typeof x === "string",

  render: FirstPlayerPanel,

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
