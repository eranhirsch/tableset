import { createGameStep } from "games/core/steps/createGameStep";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";

export default createGameStep({
  id: "clanTokens",
  InstanceManualComponent,
});

function InstanceManualComponent(): JSX.Element {
  return (
    <HeaderAndSteps
      synopsis={
        <>
          Take all of your <ChosenElement>Clan Tokens</ChosenElement>:
        </>
      }
    >
      <>
        placing one of them on the <strong>first spot</strong> of each of the{" "}
        <strong>3</strong> Clan Stats on your clan sheet:{" "}
        <ChosenElement>Rage</ChosenElement>, <ChosenElement>Axes</ChosenElement>
        , and <ChosenElement>Horns</ChosenElement>.{" "}
        <em>
          This means all players start the game with the following stats: 6
          Rage, 3 Axes, and 4 Horns
        </em>
        .
      </>
      <>
        Take your last Clan token and place it on the{" "}
        <ChosenElement>Rage Track</ChosenElement> on your clan sheet. Since your
        starting Rage stat is 6, the token is placed on the <strong>6</strong>{" "}
        spot of your Rage Track.
      </>
    </HeaderAndSteps>
  );
}
