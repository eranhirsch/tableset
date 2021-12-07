import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { playersMetaStep } from "games/global";
import { PlayerId } from "model/Player";
import { CARDS_PER_PLAYER_COUNT } from "./evidenceDeckStep";

export default createDerivedGameStep({
  id: "dealEvidence",
  dependencies: [playersMetaStep],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [playerIds],
}: DerivedStepInstanceComponentProps<readonly PlayerId[]>): JSX.Element {
  const count = playerIds!.length;
  return (
    <>
      <HeaderAndSteps synopsis="Deal the evidence deck:">
        <>Shuffle the evidence cards facedown.</>
        <>
          Deal <strong>4</strong> faceup cards, <strong>1</strong> next to each
          location card, except the <em>Go to the Cops</em> card.
        </>
        <>
          Deal <strong>3</strong> facedown in a row next to the <em>Stash</em>{" "}
          location card.
        </>
        <>
          Deal{" "}
          <strong>{(CARDS_PER_PLAYER_COUNT[count - 1] - 7) / count}</strong>{" "}
          cards out to the players facedown.
        </>
      </HeaderAndSteps>
      <em>There should be no cards remaining in the deck.</em>
    </>
  );
}
