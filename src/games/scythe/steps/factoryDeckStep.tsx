import { Vec } from "common";
import { InstanceStepLink } from "features/instance/InstanceStepLink";
import { PlayerId } from "features/players/playersSlice";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { playersMetaStep } from "games/global";
import { ScytheProductId } from "../ScytheProductId";
import { FactionId } from "../utils/Factions";
import { FactoryCards } from "../utils/FactoryCards";
import { HomeBases } from "../utils/HomeBases";
import { FactionChip } from "../ux/FactionChip";
import factionsStep from "./factionsStep";
import modularBoardVariant from "./modularBoardVariant";
import modularHomeBasesStep from "./modularHomeBasesStep";
import productsMetaStep from "./productsMetaStep";
import vesnaFactoryCardsStep from "./vesnaFactoryCardsStep";

export default createDerivedGameStep({
  id: "factoryDeck",
  dependencies: [
    playersMetaStep,
    productsMetaStep,
    modularBoardVariant,
    factionsStep,
    modularHomeBasesStep,
    vesnaFactoryCardsStep,
  ],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [
    playerIds,
    productIds,
    isModular,
    factionIds,
    homeBasesIdx,
    vesnaCards,
  ],
}: DerivedStepInstanceComponentProps<
  readonly PlayerId[],
  readonly ScytheProductId[],
  boolean,
  readonly FactionId[],
  number,
  number
>): JSX.Element {
  const vesnaIsPossible =
    productIds!.includes("fenris") &&
    (isModular
      ? homeBasesIdx == null || HomeBases.decode(homeBasesIdx).includes("vesna")
      : factionIds == null || factionIds.includes("vesna"));

  const vesnaIsPlayed = factionIds != null && factionIds.includes("vesna");

  const showShuffleStep =
    !vesnaIsPossible || vesnaCards != null || !vesnaIsPlayed;

  return (
    <HeaderAndSteps synopsis="Prepare the Factory deck:">
      {showShuffleStep && (
        <BlockWithFootnotes
          footnotes={Vec.concat(
            [
              <>
                Large cards with a purple back, numbered in sequence (at the
                upper right corner of the card) starting from 1 to{" "}
                {numberOfFactoryCards(productIds!)}.
              </>,
            ],
            vesnaIsPossible && !vesnaIsPlayed ? (
              <>
                Already done in{" "}
                <InstanceStepLink step={vesnaFactoryCardsStep} />.
              </>
            ) : (
              []
            )
          )}
        >
          {(Footnote) => (
            <>
              {vesnaIsPossible && !vesnaIsPlayed && (
                <em>
                  If not playing with <FactionChip factionId="vesna" />
                  <Footnote index={2} />:{" "}
                </em>
              )}
              Shuffle all factory cards
              <Footnote index={1} />.
            </>
          )}
        </BlockWithFootnotes>
      )}
      <BlockWithFootnotes
        footnote={
          <>
            Previously shuffled in{" "}
            <InstanceStepLink step={vesnaFactoryCardsStep} />
          </>
        }
      >
        {(Footnote) => (
          <>
            Draw <strong>{playerIds!.length + 1}</strong> cards from the{" "}
            {!showShuffleStep ? (
              <>
                <em>Factory</em> deck
                <Footnote />
              </>
            ) : (
              "deck"
            )}{" "}
            without looking at them;{" "}
            <em>
              returning the remaining{" "}
              {!vesnaIsPossible
                ? numberOfFactoryCards(productIds!) - (playerIds!.length + 1)
                : vesnaIsPlayed
                ? numberOfFactoryCards(productIds!) -
                  (playerIds!.length + 1) -
                  3
                : ""}{" "}
              cards to the box without looking at them either.
            </em>
          </>
        )}
      </BlockWithFootnotes>
      <BlockWithFootnotes footnote={<>On the right.</>}>
        {(Footnote) => (
          <>
            Put the deck of drawn cards face down on the designated area on the
            board
            <Footnote />.
          </>
        )}
      </BlockWithFootnotes>
    </HeaderAndSteps>
  );
}

const numberOfFactoryCards = (productIds: readonly ScytheProductId[]): number =>
  FactoryCards[productIds!.includes("promo4") ? "ALL_IDS" : "BASE_IDS"].length;
