import { PlayerId } from "features/players/playersSlice";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { playersMetaStep } from "games/global";
import coloniesVariant from "./coloniesVariant";
import corporateEraVariant from "./corporateEraVariant";
import turmoilVariant from "./turmoilVariant";

const PLAYER_BOARD_TRACKS = [
  "MegaCredits",
  "Steel",
  "Titanium",
  "Plants",
  "Energy",
  "Heat",
] as const;

const STARTING_TM = 20;
const SOLO_STARTING_TM = 14;

export default createDerivedGameStep({
  id: "playerComponents",
  dependencies: [
    playersMetaStep,
    corporateEraVariant,
    coloniesVariant,
    turmoilVariant,
  ],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [playerIds, isCorporateEra, isColonies, isTurmoil],
}: DerivedStepInstanceComponentProps<
  readonly PlayerId[],
  boolean,
  boolean,
  boolean
>): JSX.Element {
  const isSolo = playerIds!.length === 1;
  return (
    <HeaderAndSteps
      synopsis={
        <>
          {isSolo ? "Prepare your" : "Each player prepares their"} personal{" "}
          <ChosenElement>player components{!isSolo && "s"}</ChosenElement>:
        </>
      }
    >
      <>
        Take <strong>1</strong> <ChosenElement>player board</ChosenElement>.
      </>
      <>
        Take {isSolo && "the "}
        <strong>40</strong> transparent plastic{" "}
        <ChosenElement>player marker</ChosenElement> cubes of{" "}
        {isSolo ? "your" : "their"} color.
      </>
      <BlockWithFootnotes
        footnote={<GrammaticalList>{PLAYER_BOARD_TRACKS}</GrammaticalList>}
      >
        {(Footnote) => (
          <>
            Place a <em>player marker</em> on the number{" "}
            <ChosenElement>{isSolo || isCorporateEra ? 0 : 1}</ChosenElement> of
            each of the <em>{PLAYER_BOARD_TRACKS.length}</em>
            <Footnote /> tracks on the player board.
          </>
        )}
      </BlockWithFootnotes>
      {isSolo && isColonies && (
        <>
          <strong>Solo Colonies:</strong> reduce M€ production 2 steps.
        </>
      )}
      <>
        Place a <em>player marker</em> at the starting position{" "}
        <ChosenElement>{isSolo ? SOLO_STARTING_TM : STARTING_TM}</ChosenElement>{" "}
        of the <em>TR track</em> on the game board.
      </>
      {isColonies && (
        <>
          Colonies: Take <strong>1</strong>{" "}
          <ChosenElement>Trade Fleet</ChosenElement> and place it on the{" "}
          <em>Trade Fleets tile</em>, with {isSolo ? "a" : "their"} player
          marker inside it.
        </>
      )}
      {isTurmoil && (
        <>
          Turmoil: Take {isSolo && "the "}
          <strong>7</strong>{" "}
          <ChosenElement extraInfo="markers">delegate</ChosenElement> of{" "}
          {isSolo ? "your" : "their"} color, placing <strong>1</strong> in the{" "}
          <em>lobby</em> of the <em>Terraforming Committee</em> board, and the
          rest in the <em>Delegates Reserve</em>.
        </>
      )}
    </HeaderAndSteps>
  );
}
