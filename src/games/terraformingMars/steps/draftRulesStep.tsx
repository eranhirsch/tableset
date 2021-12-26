import { PlayerId } from "features/players/playersSlice";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { playersMetaStep } from "games/global";
import draftVariant from "./draftVariant";

export default createDerivedGameStep({
  id: "draftRules",
  dependencies: [playersMetaStep, draftVariant],
  skip: ([_, isDraft]) => !isDraft,
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [playerIds, _isDraft],
}: DerivedStepInstanceComponentProps<
  readonly PlayerId[],
  boolean
>): JSX.Element {
  return (
    <HeaderAndSteps
      synopsis={
        <>
          The drafting variant changes the rules for the <em>Research</em>{" "}
          phase:
        </>
      }
    >
      <>
        Each player draws <strong>4</strong> projects cards.
      </>
      <>
        They pick a <strong>single</strong> card and put it facedown in front of
        them.
      </>
      <>
        They <strong>pass</strong> the <em>remaining</em> <em>3</em> cards{" "}
        {playerIds!.length > 2 ? (
          <>
            either to the player to their <strong>right</strong> (on
            even-numbered generations) or to the player to their{" "}
            <strong>left</strong> (on odd-numbered generations)
          </>
        ) : (
          <>to the other player</>
        )}
        .
      </>
      <>
        They <em>continue</em> picking and passing cards until all cards have
        been drafted this way.
      </>
      <>
        Players now look at the 4 cards and decide simultaneously which ones
        they dont want to buy, <strong>discarding</strong> them facedown to the
        common discard pile.
      </>
      <>
        Players pay <strong>3M€</strong> for each card they kept.
      </>
    </HeaderAndSteps>
  );
}
