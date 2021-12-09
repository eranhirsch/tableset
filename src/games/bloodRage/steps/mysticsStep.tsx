import { createDerivedGameStep } from "games/core/steps/createDerivedGameStep";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import mysticsVariant from "./mysticsVariant";

export default createDerivedGameStep({
  id: "mystics",
  dependencies: [mysticsVariant],
  skip: ([isEnabled]) => !isEnabled,
  InstanceDerivedComponent,
});

function InstanceDerivedComponent(): JSX.Element {
  return (
    <HeaderAndSteps
      synopsis={
        <>
          Each clan has <strong>2</strong>{" "}
          <ChosenElement>Mystic figures</ChosenElement> at their disposal:
        </>
      }
    >
      <>
        Attach the appropriate color bases to all the Mystic figures to help
        identify them.
      </>
      <>
        Place all of them in the common area, next to the Monsters;
        <em>
          Players won't have access to them until their clan gets the necessary
          Clan Upgrades
        </em>
        .
      </>
      <>
        Each player takes the{" "}
        <ChosenElement>Mystic reference card</ChosenElement> for their clan and
        places it next to their clan sheet as a reference for the Mystics' basic
        Strength end ability.
      </>
    </HeaderAndSteps>
  );
}
