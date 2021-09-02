import { Strategy } from "../../../core/Strategy";
import { PlayerId } from "../../../features/players/playersSlice";
import { createDerivedGameStep } from "../../core/steps/createDerivedGameStep";
import FirstPlayerFixedTemplateLabel from "../ux/FirstPlayerFixedTemplateLabel";
import { FirstPlayerPanel } from "../ux/FirstPlayerPanel";
import StartingPlayerPanel from "../ux/StartingPlayerPanel";

export default createDerivedGameStep({
  id: "firstPlayer",

  isType: (x): x is PlayerId => typeof x === "string",

  renderInstanceItem: (current: PlayerId) => (
    <FirstPlayerPanel playerId={current} />
  ),

  random: ({ playerIds }) =>
    playerIds[Math.floor(Math.random() * playerIds.length)],

  fixed: {
    renderSelector: () => <StartingPlayerPanel />,
    renderTemplateLabel: (current) => (
      <FirstPlayerFixedTemplateLabel value={current} />
    ),
    initializer(playerIds) {
      if (playerIds.length < 2) {
        // meaningless
        return;
      }

      return {
        id: "firstPlayer",
        strategy: Strategy.FIXED,
        value: playerIds[0],
      };
    },
  },
});
