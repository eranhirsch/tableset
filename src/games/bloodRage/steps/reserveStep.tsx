import { createGameStep } from "games/core/steps/createGameStep";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";

export default createGameStep({
  id: "reserve",
  InstanceManualComponent,
});

function InstanceManualComponent(): JSX.Element {
  return (
    <HeaderAndSteps
      synopsis={
        <>
          Players takes all their faction's figures. Keep all of your figures
          near your clan sheet. This area is called your{" "}
          <ChosenElement>reserve</ChosenElement>.
        </>
      }
    >
      <>
        Your clan’s <ChosenElement>Leader figure</ChosenElement>.
      </>
      <>
        <strong>8</strong> <ChosenElement>Warrior figures</ChosenElement>.
      </>
      <>
        Make sure the <ChosenElement>small plastic bases</ChosenElement> in your
        clan’s color are attached to them. This helps easily distinguish your
        units on the board.
      </>
      <>
        Take one <ChosenElement>Ship figure</ChosenElement> and make sure it’s
        got a sail attached in your clan’s color.
      </>
      <>
        Also keep your clan’s extra <strong>2</strong> small bases and{" "}
        <strong>2</strong> large bases next to you.{" "}
        <em>They will be used if you recruit any Monsters</em>.
      </>
    </HeaderAndSteps>
  );
}
