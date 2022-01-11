import { createGameStep } from "games/core/steps/createGameStep";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";

const NUM_CARDS = 170;

export default createGameStep({
  id: "birdCards",
  InstanceManualComponent,
});

function InstanceManualComponent(): JSX.Element {
  return (
    <HeaderAndSteps>
      <>
        Shuffle the <strong>{NUM_CARDS}</strong>{" "}
        <ChosenElement extraInfo="cards">Bird</ChosenElement> into a deck.
      </>
      <>
        Place it next to the <em>bird tray</em>.
      </>
      <>
        {/* TODO: It's overkill but we technically can randomize */}
        Populate it with <strong>3</strong> face-up bird cards.
      </>
    </HeaderAndSteps>
  );
}
