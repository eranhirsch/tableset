import { PlayerId } from "features/players/playersSlice";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { playersMetaStep } from "games/global";
import { RulesSection } from "games/global/ux/RulesSection";

export default createDerivedGameStep({
  id: "soloCities",
  labelOverride: "Solo: Neutral Cities",
  dependencies: [playersMetaStep],
  skip: ([playerIds]) => playerIds!.length > 1,
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [_playerIds],
}: DerivedStepInstanceComponentProps<readonly PlayerId[]>): JSX.Element {
  return (
    <>
      <HeaderAndSteps
        synopsis={
          <>
            Place <strong>2</strong>{" "}
            <ChosenElement extraInfo="tiles">neutral city</ChosenElement> on the
            map with an{" "}
            <ChosenElement extraInfo="tile">adjacent greenery</ChosenElement>{" "}
            each:
          </>
        }
      >
        <>
          Reveal and discard the <strong>4</strong> top cards of the deck.{" "}
          <em>
            Use their cost numbers to determine the positions of the tiles
          </em>
          .
        </>
        <>
          The <ChosenElement>first city</ChosenElement> is placed counting from{" "}
          <strong>top left to right and down</strong>, like reading.{" "}
          <em>Skip any illegal placements (like areas reserved for ocean)</em>.
        </>
        <>
          For the <ChosenElement>second city</ChosenElement> you step backwards
          from <strong>bottom right</strong> in the same fashion.
        </>
        <>
          Place the two greeneries by counting the cost numbers and stepping{" "}
          <strong>clockwise around each city</strong>, starting from{" "}
          <em>top left</em>, <em>skipping illegal placements</em>.
        </>
      </HeaderAndSteps>
      <RulesSection>
        <>These tiles are not yours, and do not increase the oxygen level.</>
        <>
          <em>
            If you choose to play <strong>Tharsis Republic</strong> this game
          </em>
          : you get M€ production for the 2 neutral cities even though they are
          placed before you reveal your corporation.
        </>
      </RulesSection>
    </>
  );
}
