import { createDerivedGameStep } from "../../core/steps/createDerivedGameStep";
import MarketDisplayEncoder from "../utils/MarketDisplayEncoder";
import { MarketDisplayFixedInstructions } from "../ux/MarketDisplayFixedInstructions";

export default createDerivedGameStep({
  id: "marketDisplay",
  labelOverride: "Cards Display",

  renderInstanceItem: (hash) => <MarketDisplayFixedInstructions hash={hash} />,
  random: () => MarketDisplayEncoder.randomHash(),
});
