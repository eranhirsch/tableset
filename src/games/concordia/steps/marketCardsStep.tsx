import createDerivedGameStep from "../../core/steps/createDerivedGameStep";
import MarketCards from "../ux/MarketCards";

export default createDerivedGameStep({
  id: "marketCards",

  renderDerived: ({ playerIds }) => {
    if (playerIds.length < 1) {
      // There's really nothing meaningful to do
      return;
    }

    if (playerIds.length > 5) {
      // Not enough decks
      return;
    }

    return <MarketCards playerCount={playerIds.length} />;
  },
});
