import { createDerivedGameStep } from "games/core/steps/createDerivedGameStep";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import draftVariant from "./draftVariant";

export default createDerivedGameStep({
  id: "draftRules",
  dependencies: [draftVariant],
  skip: ([isDraft]) => !isDraft,
  InstanceDerivedComponent,
});

function InstanceDerivedComponent(): JSX.Element {
  return (
    <HeaderAndSteps
      synopsis={
        <>
          The drafting variant changes the rules for the <em>Ressearch</em>{" "}
          phase:
        </>
      }
    >
      <>
        Each player draws <strong>4</strong> projects cards.
      </>
      <>
        They pick a <strong>single</strong> card and put it in front of them,
        facedown.
      </>
      <>
        They pass the <em>remaining</em> cards either to the player to their{" "}
        <strong>right</strong> (on even-numbered generations) or to the player
        to their <strong>left</strong> (on odd-numbered generations).
      </>
      <>
        They continue picking and passing cards until each player has drafted 4
        cards in front of them.
      </>
      <>
        Players now look at the 4 cards and decide simultaneously which ones
        they want to buy.
      </>
      <>
        Players discard the cards they don't want to keep to the common discard
        pile, facedown.
      </>
      <>
        Players pay <strong>3M€</strong> for each card they kept.
      </>
    </HeaderAndSteps>
  );
}
