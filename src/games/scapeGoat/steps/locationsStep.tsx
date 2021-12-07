import { Vec } from "common";
import { createGameStep } from "games/core/steps/createGameStep";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";

export const OTHER_CARDS = ["Spy", "Stash", "Trade"];

export default createGameStep({
  id: "locations",
  InstanceManualComponent,
});

function InstanceManualComponent(): JSX.Element {
  return (
    <HeaderAndSteps synopsis="Arrange the location cards in a line in the center of the table">
      <>
        Place the <ChosenElement>Prepare</ChosenElement> location card at the
        far left.
      </>
      <>
        Place the {OTHER_CARDS.length} cards:{" "}
        <GrammaticalList>
          {Vec.map(OTHER_CARDS, (card) => (
            <ChosenElement key={card}>{card}</ChosenElement>
          ))}
        </GrammaticalList>{" "}
        from left to right.
      </>
      <>
        Place the <ChosenElement>Go to the Cops</ChosenElement> card at the far
        right of the line.
      </>
      <>
        Place <strong>2</strong>{" "}
        <ChosenElement extraInfo="(glass)">preparation tokens</ChosenElement> on
        the <em>Prepare</em> location card.
      </>
    </HeaderAndSteps>
  );
}
