import { invariant, Vec } from "common";
import { playersMetaStep } from "games/core/steps/createPlayersDependencyMetaStep";
import { PlayerId } from "model/Player";
import React from "react";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "../../core/steps/createDerivedGameStep";
import { BlockWithFootnotes } from "../../core/ux/BlockWithFootnotes";
import { GrammaticalList } from "../../core/ux/GrammaticalList";
import { HeaderAndSteps } from "../../core/ux/HeaderAndSteps";
import { ConcordiaProductId } from "../ConcordiaProductId";
import { MARKET_DECK_I } from "../utils/MarketDisplayEncoder";
import { ROMAN_NUMERALS } from "../utils/ROMAN_NUMERALS";
import RomanTitle from "../ux/RomanTitle";
import productsMetaStep from "./productsMetaStep";
import venusScoringVariant from "./venusScoringVariant";

const CARDS_PER_DECK = {
  base: [
    // the array is 0-indexed
    undefined,
    // I: ...
    MARKET_DECK_I.base.length,
    // II: Architect, Prefect, Mercator, Colonist, Consul, Vintner, Weaver
    7,
    // III: Architect, Prefect, Mercator, Colonist, Diplomat, Consul
    6,
    // IV: Architect, Prefect, Colonist, Diplomat, Consul
    5,
    // V: Prefect, Mercator, Diplomat, Consul
    4,
  ],
  venus: [
    // the array is 0-indexed
    undefined,
    // I: ...
    MARKET_DECK_I.venus.length,
    // II: Mason, Architect/Mercator, Prefect, Mercator, Colonist, Consul, Vintner, Weaver
    8,
    // III: Architect, Prefect, Prefect/Mercator, Colonist, Diplomat, Consul
    6,
    // IV: Architect/Mercator, Prefect, Colonist, Diplomat, Consul
    5,
    // V: Prefect, Mercator, Diplomat, Consul
    4,
  ],
} as const;

type REPLACEMENT = [base: string, venus: string];
const VENUS_REPLACEMENTS: readonly REPLACEMENT[] = [
  ["Prefect", "Prefect/Architect"],
  ["Architect", "Architect/Mercator"],
  ["Mercator", "Prefect/Mercator"],
  ["Architect", "Architect/Mercator"],
];

const MAX_PLAYER_COUNT = CARDS_PER_DECK.base.length - 1;

export default createDerivedGameStep({
  id: "personalityCards",
  dependencies: [playersMetaStep, productsMetaStep, venusScoringVariant],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [playerIds, products, venusScoring],
}: DerivedStepInstanceComponentProps<
  readonly PlayerId[],
  readonly ConcordiaProductId[],
  boolean
>): JSX.Element {
  const relevantProducts = products!.includes("base")
    ? products!.includes("venus")
      ? "venus"
      : "base"
    : "venusBase";

  return (
    <HeaderAndSteps synopsis="Prepare the personality cards decks:">
      <CardSelectionStep
        playerIds={playerIds}
        relevantProducts={relevantProducts}
        venusScoring={venusScoring ?? false}
      />
      {!venusScoring && relevantProducts === "venusBase" && (
        <RemoveVenusCardsStep playerIds={playerIds} />
      )}
      {!venusScoring && relevantProducts === "venusBase" && (
        <AddReplacementCardsStep playerIds={playerIds} />
      )}
      <>Create a separate deck for each numeral.</>
      {!venusScoring && relevantProducts === "venusBase" && (
        <>
          Move the{" "}
          <strong>
            <RomanTitle>Mason</RomanTitle>
          </strong>{" "}
          card from deck <strong>II</strong> to deck <strong>I</strong>.
        </>
      )}
    </HeaderAndSteps>
  );
}

function CardSelectionStep({
  playerIds,
  venusScoring,
  relevantProducts,
}: {
  playerIds: readonly PlayerId[] | null | undefined;
  venusScoring: boolean;
  relevantProducts: "base" | "venus" | "venusBase";
}): JSX.Element {
  invariant(
    // This protects us from the only meaningless case which is that venus
    // scoring is turned on when there are no venus products. We need this here
    // because we handle each combination of product and scoring separately.
    !(relevantProducts === "base" && venusScoring),
    `Trying to setup a venus scoring game when no venus product is enabled`
  );

  if (playerIds == null) {
    return (
      <UnknownPlayerCount
        venusScoring={venusScoring}
        relevantProducts={relevantProducts}
      />
    );
  }

  const playerCount = playerIds.length;
  return playerCount >= MAX_PLAYER_COUNT ? (
    <MaxPlayerCount
      venusScoring={venusScoring}
      relevantProducts={relevantProducts}
    />
  ) : (
    <PartialPlayerCount playerCount={playerCount} venusScoring={venusScoring} />
  );
}

function UnknownPlayerCount({
  venusScoring,
  relevantProducts,
}: {
  venusScoring: boolean;
  relevantProducts: "base" | "venus" | "venusBase";
}): JSX.Element {
  return (
    <BlockWithFootnotes
      footnotes={[
        <>
          e.g. for a 3 player game take all cards with numerals I, II, and III
          and leave cards with numerals IV and V in the box.
        </>,
        <AllCardsCountsFootnote venusScoring={venusScoring} />,
      ]}
    >
      {(Footnote) => (
        <>
          Take all cards with{" "}
          <CardBackDescription
            venusScoring={venusScoring}
            relevantProducts={relevantProducts}
          />{" "}
          {relevantProducts === "base" ? (
            "with value"
          ) : relevantProducts === "venus" && !venusScoring ? (
            <>, where the numeral value is</>
          ) : (
            <>, and where the numeral value is</>
          )}{" "}
          up to and including the number of players;{" "}
          <em>
            leaving cards with{" "}
            {relevantProducts !== "base" &&
              `${
                relevantProducts === "venus" && !venusScoring
                  ? "VENVS"
                  : "CONCORDIA"
              } and with `}
            higher values in the box (they won't be needed)
          </em>
          <Footnote index={1} />
          <Footnote index={2} />.
        </>
      )}
    </BlockWithFootnotes>
  );
}

function MaxPlayerCount({
  venusScoring,
  relevantProducts,
}: {
  venusScoring: boolean;
  relevantProducts: "base" | "venus" | "venusBase";
}): JSX.Element {
  return (
    <BlockWithFootnotes
      footnote={<AllCardsCountsFootnote venusScoring={venusScoring} />}
    >
      {(Footnote) => (
        <>
          Take all cards with{" "}
          <CardBackDescription
            venusScoring={venusScoring}
            relevantProducts={relevantProducts}
          />
          <Footnote />.
        </>
      )}
    </BlockWithFootnotes>
  );
}

function PartialPlayerCount({
  playerCount,
  venusScoring,
}: {
  playerCount: number;
  venusScoring: boolean;
}): JSX.Element {
  return (
    <BlockWithFootnotes
      footnotes={Vec.filter_nulls(
        Vec.map(
          CARDS_PER_DECK[venusScoring ? "venus" : "base"],
          (count, index) =>
            count && (
              <>
                {count} cards with numeral{" "}
                <strong>{ROMAN_NUMERALS[index]}</strong>.
              </>
            )
        )
      )}
    >
      {(Footnote) => (
        <>
          Take all cards with{" "}
          <GrammaticalList pluralize="numeral">
            {Vec.range(1, playerCount).map((i) => (
              <React.Fragment key={`deck_${i}`}>
                <strong>{ROMAN_NUMERALS[i]}</strong>
                <Footnote index={i} />
              </React.Fragment>
            ))}
          </GrammaticalList>{" "}
          on the back;{" "}
          <em>
            leaving cards with{" "}
            <GrammaticalList pluralize="numeral">
              {Vec.range(playerCount + 1, MAX_PLAYER_COUNT).map((x) => (
                <React.Fragment key={`leave_in_box_deck_${x}`}>
                  <strong>{ROMAN_NUMERALS[x]!}</strong>
                  <Footnote index={x} />
                </React.Fragment>
              ))}
            </GrammaticalList>{" "}
            on the back in the box (they won't be needed)
          </em>
          .
        </>
      )}
    </BlockWithFootnotes>
  );
}

function RemoveVenusCardsStep({
  playerIds,
}: {
  playerIds: readonly PlayerId[] | null | undefined;
}): JSX.Element {
  const venusCards =
    playerIds == null
      ? VENUS_REPLACEMENTS
      : Vec.take(VENUS_REPLACEMENTS, playerIds.length - 1);

  return (
    <BlockWithFootnotes
      footnote={
        <>
          <GrammaticalList>
            {Vec.map(venusCards, ([_, card], index) => (
              <>
                {ROMAN_NUMERALS[index + 1]}: <RomanTitle>{card}</RomanTitle>
              </>
            ))}
          </GrammaticalList>
          .
        </>
      }
    >
      {(Footnote) => (
        <>
          Return to the box{" "}
          {playerIds != null ? `the ${venusCards.length}` : "all"} cards with
          double-roles and green <strong>VENVS</strong> scoring on the front
          <Footnote />.
        </>
      )}
    </BlockWithFootnotes>
  );
}

function AddReplacementCardsStep({
  playerIds,
}: {
  playerIds: readonly PlayerId[] | null | undefined;
}): JSX.Element {
  const venusCards =
    playerIds == null
      ? VENUS_REPLACEMENTS
      : Vec.take(VENUS_REPLACEMENTS, playerIds.length - 1);

  const footnotes = Vec.concat(
    [
      <>
        <GrammaticalList>
          {Vec.map(venusCards, ([card, _], index) => (
            <>
              {ROMAN_NUMERALS[index + 1]}: <RomanTitle>{card}</RomanTitle>
            </>
          ))}
        </GrammaticalList>
        .
      </>,
    ],
    // We only need the other footnote when the player count isn't known
    playerIds == null ? (
      <>e.g. for a 3 player game take cards I, II, and III.</>
    ) : (
      []
    )
  );

  return (
    <BlockWithFootnotes footnotes={footnotes}>
      {(Footnote) => (
        <>
          Exchange the returned cards with cards that have{" "}
          <strong>neither</strong> <em>a pillar icon</em> (on the bottom left
          corner) or <em>an interlocking circles icon</em> (on the bottom right
          corner)
          {playerIds != null ? (
            <>
              {" "}
              and with numerals{" "}
              <GrammaticalList>
                {Vec.map(venusCards, (_, index) => (
                  <strong>{ROMAN_NUMERALS[index + 1]}</strong>
                ))}
              </GrammaticalList>{" "}
              on the back
            </>
          ) : (
            <>
              ; matching the roman numeral
              <Footnote index={2} />
            </>
          )}
          <Footnote index={1} />.
        </>
      )}
    </BlockWithFootnotes>
  );
}

function CardBackDescription({
  venusScoring,
  relevantProducts,
}: {
  venusScoring: boolean;
  relevantProducts: "base" | "venus" | "venusBase";
}): JSX.Element {
  if (relevantProducts === "base") {
    return <>roman numerals on the back</>;
  }

  if (relevantProducts === "venus" && !venusScoring) {
    return (
      <>
        <strong>CONCORDIA</strong> and <em>a roman numeral</em> on the back
      </>
    );
  }

  return (
    <>
      <strong>VENVS</strong>, <em>a roman numeral</em>, and{" "}
      <em>a small pillar icon</em> (at the bottom left corner), all on the back
      of the card
    </>
  );
}

function AllCardsCountsFootnote({
  venusScoring,
}: {
  venusScoring: boolean;
}): JSX.Element {
  return (
    <>
      <GrammaticalList>
        {Vec.filter_nulls(
          Vec.map(
            CARDS_PER_DECK[venusScoring ? "venus" : "base"],
            (count, index) =>
              count != null ? (
                <>
                  {count} cards with numeral
                  <strong>
                    <RomanTitle>{ROMAN_NUMERALS[index]}</RomanTitle>
                  </strong>
                </>
              ) : null
          )
        )}
      </GrammaticalList>
      .
    </>
  );
}