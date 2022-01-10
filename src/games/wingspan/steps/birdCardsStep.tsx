import { createGameStep } from "games/core/steps/createGameStep";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";

export default createGameStep({
  id: "birdCards",
  InstanceManualComponent,
});

function InstanceManualComponent(): JSX.Element {
  return (
    <HeaderAndSteps>
      {/* TODO: Add a count of cards based on expansions. */}
      <>Shuffle the bird cards into a deck.</>
      <>Place it next to the bird tray.</>
      {/* TODO: It's overkill but we technically can randomize */}
      <>
        Populate it with <strong>3</strong> face-up bird cards.
      </>
    </HeaderAndSteps>
  );
}
