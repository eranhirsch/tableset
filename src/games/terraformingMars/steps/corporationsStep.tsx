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
import { activeDecks, availableDecksForProducts, Decks } from "../utils/Decks";
import corporateEraVariant from "./corporateEraVariant";
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
  ],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [playerIds, productIds, isCorporateEra, isVenus, isVenusCorps],
}: DerivedStepInstanceComponentProps<
  readonly PlayerId[],
  readonly TerraformingMarsProductId[],
  boolean,
  boolean,
  boolean
>): JSX.Element {
  const isSolo = playerIds!.length === 1;

  const decksInUse = useMemo(
    () => activeDecks(playerIds!.length === 1, isCorporateEra!, isVenus!),
    [isCorporateEra, isVenus, playerIds]
  );

  const inactiveDecks = useMemo(
    () =>
      Dict.select_keys(
        Decks,
        Vec.diff(availableDecksForProducts(productIds!), decksInUse)
      ),
    [decksInUse, productIds]
  );

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
      {isVenusCorps && (
        <BlockWithFootnotes
          footnote={
            <>
              These are marked with a {Decks.venus.icon} icon in the lower left
              edge.
            </>
          }
        >
          {(Footnote) => (
            <>
              Find the <strong>{Decks.venus.corps}</strong>{" "}
              <ChosenElement extraInfo="corporations">
                {Decks.venus.name}
              </ChosenElement>
              <Footnote />.
            </>
          )}
        </BlockWithFootnotes>
      )}
      {isVenusCorps && <>Shuffle them.</>}
      {isVenusCorps && (
        <>
          {isSolo ? "Draw" : "Deal"} <strong>1</strong> of these
          {!isSolo && " to each remaining player"}.
        </>
      )}
      <>
        Shuffle the remaining{" "}
        <strong>
          {$(
            Vec.filter(decksInUse, (deck) => !isVenusCorps || deck !== "venus"),
            ($$) => Dict.select_keys(Decks, $$),
            ($$) => Vec.map_with_key($$, (_, { corps }) => corps),
            MathUtils.sum
          )}
        </strong>{" "}
        <ChosenElement extraInfo="corporations">normal</ChosenElement>.
      </>
      <>
        {isSolo ? "Draw" : "Deal"} <strong>{isVenusCorps ? 1 : 2}</strong>{" "}
        corporations
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
