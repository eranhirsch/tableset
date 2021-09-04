import createDerivedGameStep from "../../core/steps/createDerivedGameStep";
import MarketCards from "../ux/MarketCards";

export default createDerivedGameStep({
  id: "marketCards",
  renderDerived: MarketCards,
});
