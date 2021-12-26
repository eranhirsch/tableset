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
  dependencies: [playersMetaStep, corporateEraVariant],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [playerIds, isCorporateEra],
}: DerivedStepInstanceComponentProps<
  readonly PlayerId[],
  boolean
>): JSX.Element {
  return (
    <HeaderAndSteps
      synopsis={
        <>
          Each player prepares their personal{" "}
          <ChosenElement>player boards</ChosenElement>:
        </>
      }
    >
      <>
        Take <strong>1</strong> <ChosenElement>player board</ChosenElement>.
      </>
      <>
        Take <strong>40</strong> transparent plastic{" "}
        <ChosenElement>player marker</ChosenElement> cubes of their color.
      </>
      <BlockWithFootnotes
        footnote={<GrammaticalList>{PLAYER_BOARD_TRACKS}</GrammaticalList>}
      >
        {(Footnote) => (
          <>
            Place a <em>player marker</em> on the number{" "}
            <ChosenElement>
              {playerIds!.length === 1 || isCorporateEra ? 0 : 1}
            </ChosenElement>{" "}
            of each of the <em>{PLAYER_BOARD_TRACKS.length}</em>
            <Footnote /> tracks on the player board.
          </>
        )}
      </BlockWithFootnotes>
      <>
        Place a <em>player marker</em> at the starting position{" "}
        <ChosenElement>20</ChosenElement> of the <em>TR track</em> on the game
        board.
      </>
    </HeaderAndSteps>
  );
}
