import { Chip } from "@mui/material";
import { createDerivedGameStep } from "games/core/steps/createDerivedGameStep";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { Decks } from "../utils/Decks";
import turmoilVariant from "./turmoilVariant";

export default createDerivedGameStep({
  id: "turmoil",
  dependencies: [turmoilVariant],
  skip: ([isTurmoil]) => !isTurmoil,
  InstanceDerivedComponent,
});

function InstanceDerivedComponent(): JSX.Element {
  return (
    <HeaderAndSteps>
      <>
        Place a gray <em>neutral</em>{" "}
        <ChosenElement extraInfo="marker">delegate</ChosenElement> in the{" "}
        <em>Chairman seat</em> on the <em>Terraforming Committee</em> board.
      </>
      <>
        Shuffle the <strong>{Decks.turmoil.events}</strong>{" "}
        <ChosenElement extraInfo="cards">Global Event</ChosenElement>.
      </>
      <>
        Place the deck on the reserved space on the <em>Global Events</em>{" "}
        board.
      </>
      <>
        Draw <strong>1</strong> card from the <em>Global Event</em> deck and
        place it face up on the space marked <em>"Coming Global Event"</em>.
      </>
      <>
        Place a <em>neutral</em> delegate as{" "}
        <ChosenElement>Party Leader</ChosenElement> in the party indicated at
        the top left of the card.
      </>
      <>
        Place the <ChosenElement extraInfo="marker">dominance</ChosenElement> in
        the area for delegates of the that party.
      </>
      <>
        Turn over the top card of the <em>Global Event</em> deck face up.
      </>
      <>
        Place a <em>neutral</em> delegate as{" "}
        <ChosenElement>Party Leader</ChosenElement> to the party indicated at
        the top left of that card
        <em>
          ; if it is in the same party as the other neutral delegate, place it
          in the area for delegates instead
        </em>
        .
      </>
      <>
        Put the remaining <strong>11</strong> gray <em>neutral</em>{" "}
        <ChosenElement extraInfo="markers">delegate</ChosenElement> in the{" "}
        <em>Neutral Reserve</em> on the <em>Terraforming Committee</em> board.
      </>
      <>
        Place all <strong>6</strong>{" "}
        <ChosenElement extraInfo="tiles">Policy</ChosenElement> in a pile at
        their designated place on the <em>Terraforming Committee</em> board,
        with <Chip size="small" color="green" label="GREENS" /> on top.
      </>
    </HeaderAndSteps>
  );
}
