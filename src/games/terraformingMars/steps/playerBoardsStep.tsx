import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import corporateEraVariant from "./corporateEraVariant";

const PLAYER_BOARD_TRACKS = [
  "MegaCredits",
  "Steel",
  "Titanium",
  "Plants",
  "Energy",
  "Heat",
] as const;

export default createDerivedGameStep({
  id: "playerBoards",
  dependencies: [corporateEraVariant],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [isCorporateEra],
}: DerivedStepInstanceComponentProps<boolean>): JSX.Element {
  return (
    <HeaderAndSteps
      synopsis={
        <>
          Players take the following components and prepare their personal{" "}
          <ChosenElement>player boards</ChosenElement>:
        </>
      }
    >
      <>
        Take <strong>1</strong> <ChosenElement>player board</ChosenElement>.
      </>
      <>
        <strong>40</strong> transparent plastic{" "}
        <ChosenElement>player marker</ChosenElement> cubes of their color.
      </>
      <BlockWithFootnotes
        footnote={<GrammaticalList>{PLAYER_BOARD_TRACKS}</GrammaticalList>}
      >
        {(Footnote) => (
          <>
            Place a player marker on{" "}
            <strong>the number {isCorporateEra ? 0 : 1}</strong> of each of the{" "}
            <em>{PLAYER_BOARD_TRACKS.length}</em>
            <Footnote /> tracks on the player board.
          </>
        )}
      </BlockWithFootnotes>
      <>
        Place a player marker at the starting position <strong>(20)</strong> of
        the <em>TR track</em> on the game board.
      </>
    </HeaderAndSteps>
  );
}
