import { $, Dict, MathUtils, Vec } from "common";
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
import { useMemo } from "react";
import {
  activeDecks,
  availableDecksForProducts,
  DeckId,
  Decks,
} from "../utils/Decks";
import coloniesCorpsVariant from "./coloniesCorpsVariant";
import coloniesVariant from "./coloniesVariant";
import corporateEraVariant from "./corporateEraVariant";
import preludeCorpsVariant from "./preludeCorpsVariant";
import productsMetaStep, {
  TerraformingMarsProductId,
} from "./productsMetaStep";
import venusCorpsVariant from "./venusCorpsVariant";
import venusVariant from "./venusVariant";

export default createDerivedGameStep({
  id: "corporation",
  dependencies: [
    playersMetaStep,
    productsMetaStep,
    corporateEraVariant,
    venusVariant,
    venusCorpsVariant,
    preludeCorpsVariant,
    coloniesVariant,
    coloniesCorpsVariant,
  ],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [
    playerIds,
    productIds,
    isCorporateEra,
    isVenus,
    isVenusCorps,
    isPreludeCorps,
    isColonies,
    isColoniesCorps,
  ],
}: DerivedStepInstanceComponentProps<
  readonly PlayerId[],
  readonly TerraformingMarsProductId[],
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
  boolean
>): JSX.Element {
  const isSolo = playerIds!.length === 1;

  const available = useMemo(
    () => availableDecksForProducts(productIds!),
    [productIds]
  );

  const decksInUse = useMemo(
    () =>
      Vec.intersect(
        available,
        activeDecks(
          playerIds!.length === 1,
          isCorporateEra!,
          isVenus!,
          isColonies!
        )
      ),
    [available, isColonies, isCorporateEra, isVenus, playerIds]
  );

  const inactiveDecks = useMemo(
    () => Dict.select_keys(Decks, Vec.diff(available, decksInUse)),
    [available, decksInUse]
  );

  // Each expansion enables a variant where that expansion's corporation are
  // always dealt to players (and not randomly shuffled with the other
  // corporations)
  const forceExpansionCorps: DeckId | null = isVenusCorps
    ? "venus"
    : isPreludeCorps
    ? "prelude"
    : isColoniesCorps
    ? "colonies"
    : null;

  return (
    <HeaderAndSteps>
      <BlockWithFootnotes
        footnote={
          <>
            There are <strong>5</strong> Beginner Corporation cards.
          </>
        }
      >
        {(Footnote) => (
          <>
            <em>
              {isSolo ? "If" : "Players"} <strong>new</strong> to Terraforming
              Mars:
            </em>{" "}
            Take a <ChosenElement>Beginner Corporation</ChosenElement>
            {isSolo ? (
              <>
                {" "}
                and skip the other steps bellow. <em>Otherwise</em> put all
                Beginner Corporation cards back in the box
              </>
            ) : (
              <em>
                ; all remaining Beginner Corporation cards
                <Footnote /> should be returned back to the box
              </em>
            )}
            .
          </>
        )}
      </BlockWithFootnotes>
      {!Dict.is_empty(inactiveDecks) && (
        <BlockWithFootnotes
          footnotes={Vec.map_with_key(inactiveDecks, (_, { icon }) => (
            <>These are marked with a {icon} icon in the lower left edge.</>
          ))}
        >
          {(Footnote) => (
            <>
              Return{" "}
              <GrammaticalList>
                {Vec.map_with_key(
                  inactiveDecks,
                  (_, { name, corps }, index) => (
                    <>
                      the <strong>{corps}</strong>{" "}
                      <ChosenElement extraInfo="corporations">
                        {name}
                      </ChosenElement>
                      <Footnote index={index + 1} />
                    </>
                  )
                )}
              </GrammaticalList>{" "}
              back to the box.
            </>
          )}
        </BlockWithFootnotes>
      )}
      {forceExpansionCorps != null && (
        <BlockWithFootnotes
          footnote={
            <>
              These are marked with a {Decks[forceExpansionCorps].icon} icon in
              the lower left edge.
            </>
          }
        >
          {(Footnote) => (
            <>
              Find the <strong>{Decks[forceExpansionCorps].corps}</strong>{" "}
              <ChosenElement extraInfo="corporations">
                {Decks[forceExpansionCorps].name}
              </ChosenElement>
              <Footnote />.
            </>
          )}
        </BlockWithFootnotes>
      )}
      {forceExpansionCorps != null && <>Shuffle them.</>}
      {forceExpansionCorps != null && (
        <>
          {isSolo ? "Draw" : "Deal"} <strong>1</strong> of these
          {!isSolo && " to each remaining player"}.
        </>
      )}
      <>
        Shuffle the remaining{" "}
        <strong>
          {$(
            Vec.filter(decksInUse, (deck) => deck !== forceExpansionCorps),
            ($$) => Dict.select_keys(Decks, $$),
            ($$) => Vec.map_with_key($$, (_, { corps }) => corps),
            MathUtils.sum
          )}
        </strong>{" "}
        <ChosenElement extraInfo="corporations">normal</ChosenElement>.
      </>
      <>
        {isSolo ? "Draw" : "Deal"}{" "}
        <strong>{forceExpansionCorps != null ? 1 : 2}</strong> corporations
        {!isSolo && (
          <>
            {" "}
            to each remaining player
            <em>; players should keep these cards hidden</em>
          </>
        )}
        .
      </>
    </HeaderAndSteps>
  );
}
