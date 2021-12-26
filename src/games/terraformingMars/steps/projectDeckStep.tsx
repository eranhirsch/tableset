import { $, Dict, MathUtils, Vec } from "common";
import { PlayerId } from "features/players/playersSlice";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps
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
  TerraformingMarsProductId
} from "./productsMetaStep";
import venusVariant from "./venusVariant";

export default createDerivedGameStep({
  id: "projectDeck",
  dependencies: [
    playersMetaStep,
    productsMetaStep,
    corporateEraVariant,
    venusVariant,
  ],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [playerIds, productIds, isCorporateEra, isVenus],
}: DerivedStepInstanceComponentProps<
  readonly PlayerId[],
  readonly TerraformingMarsProductId[],
  boolean,
  boolean
>): JSX.Element {
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
                  (_, { name, projects }, index) => (
                    <>
                      the <strong>{projects}</strong>{" "}
                      <ChosenElement extraInfo="projects">{name}</ChosenElement>
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
      <>
        Shuffle {Dict.is_empty(inactiveDecks) ? "all" : "the remaining"}{" "}
        <strong>
          {$(
            Dict.select_keys(Decks, decksInUse),
            ($$) => Vec.map_with_key($$, (_, { projects }) => projects),
            MathUtils.sum
          )}
        </strong>{" "}
        project cards.
      </>
      <>
        Place the project deck next to the board
        <em>; Leave space for a discard pile beside it</em>.
      </>
    </HeaderAndSteps>
  );
}
