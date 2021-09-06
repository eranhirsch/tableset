import createDerivedGameStep from "../../core/steps/createDerivedGameStep";
import createPlayersDependencyMetaStep from "../../core/steps/createPlayersDependencyMetaStep";
import MarketCards from "../ux/MarketCards";

export default createDerivedGameStep({
  id: "marketCards",
  dependencies: [createPlayersDependencyMetaStep({ max: 5 })],
  renderDerived: MarketCards,
});
