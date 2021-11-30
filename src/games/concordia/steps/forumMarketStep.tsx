import { createDerivedGameStep } from "games/core/steps/createDerivedGameStep";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import forumVariantStep from "./forumVariant";

export default createDerivedGameStep({
  id: "forumMarket",
  dependencies: [forumVariantStep],
  skip: ([forum]) => !forum,
  InstanceDerivedComponent,
});

function InstanceDerivedComponent(): JSX.Element {
  return (
    <HeaderAndSteps synopsis="Prepare the forum tiles market:">
      <>
        Shuffle the remaining Patrician tiles and all Citizen tiles into a
        single deck.
      </>
      <>
        Reveal 4 tiles from the top of the deck and place them from
        left-to-right on the forum display.
      </>
      <>Place the rest of the forum deck next to the forum display.</>
      <>
        <em>Optionally:</em> place the blank forum tile on top of the deck so
        that the next card in the deck is hidden.
      </>
    </HeaderAndSteps>
  );
}
