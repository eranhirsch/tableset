import { createGameStep } from "../../core/steps/createGameStep";
import MarketDisplayEncoder from "../utils/MarketDisplayEncoder";
import { MarketDisplayFixedInstructions } from "../ux/MarketDisplayFixedInstructions";

export default createGameStep({
  id: "marketDisplay",
  labelOverride: "Cards Display",

  derivers: {
    renderInstanceItem: (hash) => (
      <MarketDisplayFixedInstructions hash={hash} />
    ),
    random: () => MarketDisplayEncoder.randomHash(),
  },
});
