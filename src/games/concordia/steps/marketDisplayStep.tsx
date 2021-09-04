import createVariableGameStep from "../../core/steps/createVariableGameStep";
import MarketDisplayEncoder from "../utils/MarketDisplayEncoder";
import MarketDisplayFixedInstructions from "../ux/MarketDisplayFixedInstructions";

export default createVariableGameStep({
  id: "marketDisplay",
  labelOverride: "Cards Display",

  renderInstanceItem: (hash) => <MarketDisplayFixedInstructions hash={hash} />,
  random: () => MarketDisplayEncoder.randomHash(),
});
