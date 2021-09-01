import { createGameStep } from "../../core/steps/createGameStep";
import MarketDisplayEncoder from "../utils/MarketDisplayEncoder";
import { MarketDisplayFixedInstructions } from "../ux/MarketDisplayFixedInstructions";

export default createGameStep({
  id: "marketDisplay",
  labelOverride: "Cards Display",

  derivers: {
    isType(x): x is string {
      return typeof x === "string";
    },
    renderInstanceItem: (hash) => (
      <MarketDisplayFixedInstructions hash={hash} />
    ),
    random: () => MarketDisplayEncoder.randomHash(),
  },
});
