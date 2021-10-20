import { invariant, Vec } from "common";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import React from "react";
import { ConcordiaProductId } from "../ConcordiaProductId";
import RomanTitle from "../ux/RomanTitle";
import productsMetaStep from "./productsMetaStep";
import venusScoringVariant from "./venusScoringVariant";

const PLAYER_CARDS = {
  base: [
    "Architect",
    "Diplomat",
    "Mercator",
    "Prefect",
    "Prefect",
    "Senator",
    "Tribune",
  ],
  venus: [
    "Architect",
    "Diplomat",
    "Magister",
    "Mercator",
    "Prefect",
    "Prefect",
    "Senator",
    "Tribune",
  ],
} as const;

export default createDerivedGameStep({
  id: "playerCards",
  labelOverride: "Player Hand",
  dependencies: [productsMetaStep, venusScoringVariant],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [products, venusScoring],
}: DerivedStepInstanceComponentProps<
  readonly ConcordiaProductId[],
  boolean
>): JSX.Element {
  const relevantProduct = products!.includes("base")
    ? products!.includes("venus")
      ? "venus"
      : "base"
    : "venusBase";

  invariant(
    // Safe-guard against impossible states
    relevantProduct !== "base" || !venusScoring,
    `Venus scoring enabled for a base only game: ${JSON.stringify(products)}`
  );

  switch (relevantProduct) {
    case "base":
      return (
        <BlockWithFootnotes footnote={<CardsFootnote />}>
          {(Footnote) => (
            <>
              Each player takes to their hand the {PLAYER_CARDS.base.length}{" "}
              cards <em>of their color</em>
              <Footnote />.
            </>
          )}
        </BlockWithFootnotes>
      );

    case "venusBase":
      return <VenusBaseCards venusScoring={venusScoring ?? false} />;

    case "venus":
      return (
        <BlockWithFootnotes
          footnote={<CardsFootnote venusScoring={venusScoring ?? false} />}
        >
          {(Footnote) => (
            <>
              Each player takes to their hand the{" "}
              {PLAYER_CARDS[venusScoring ? "venus" : "base"].length} cards{" "}
              <em>of their color</em> with{" "}
              {venusScoring ? "VENVS" : "CONCORDIA"}{" "}
              {venusScoring && (
                <>
                  and <strong>a small pilar icon</strong> (at the bottom right
                  corner){" "}
                </>
              )}
              on the back
              <Footnote />.
            </>
          )}
        </BlockWithFootnotes>
      );
  }
}

/**
 * We extracted the venus base version of the setup because it's the only one
 * that might contain 2 steps (in cases where the base game is played with
 * the venus cards).
 */
function VenusBaseCards({
  venusScoring,
}: {
  venusScoring: boolean;
}): JSX.Element {
  const takeCardsStep = (
    <BlockWithFootnotes footnote={<CardsFootnote venusScoring />}>
      {(Footnote) => (
        <>
          {venusScoring ? "Each player takes to their hand" : "Take"} the{" "}
          {PLAYER_CARDS.venus.length} cards <em>of their color</em> with{" "}
          <strong>a small pilar icon</strong> (at the bottom right corner)
          <Footnote />.
        </>
      )}
    </BlockWithFootnotes>
  );

  if (venusScoring) {
    return takeCardsStep;
  }

  return (
    <HeaderAndSteps synopsis="Each player prepares their starting hand:">
      {takeCardsStep}
      {!venusScoring && (
        <>
          Return the{" "}
          <strong>
            <RomanTitle>Magister</RomanTitle>
          </strong>{" "}
          card to the box.
        </>
      )}
    </HeaderAndSteps>
  );
}

function CardsFootnote({
  venusScoring = false,
}: {
  venusScoring?: boolean;
}): JSX.Element {
  return (
    <>
      <GrammaticalList>
        {Vec.map(PLAYER_CARDS[venusScoring ? "venus" : "base"], (card) => (
          <React.Fragment key={card}>
            <RomanTitle>{card}</RomanTitle>
          </React.Fragment>
        ))}
      </GrammaticalList>
      .
    </>
  );
}
