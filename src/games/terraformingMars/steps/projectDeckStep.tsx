import { $, Dict, MathUtils, Vec } from "common";
import { PlayerId } from "features/players/playersSlice";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps
} from "games/core/steps/createDerivedGameStep";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { playersMetaStep } from "games/global";
import { useMemo } from "react";
import { activeDecks, availableDecksForProducts, Decks } from "../utils/Decks";
import coloniesVariant from "./coloniesVariant";
import corporateEraVariant from "./corporateEraVariant";
import productsMetaStep, {
  TerraformingMarsProductId,
} from "./productsMetaStep";
import turmoilVariant from "./turmoilVariant";
import venusVariant from "./venusVariant";

export default createDerivedGameStep({
  id: "projectDeck",
  dependencies: [
    playersMetaStep,
    productsMetaStep,
    corporateEraVariant,
    venusVariant,
    coloniesVariant,
    turmoilVariant,
  ],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [
    playerIds,
    productIds,
    isCorporateEra,
    isVenus,
    isColonies,
    isTurmoil,
  ],
}: DerivedStepInstanceComponentProps<
  readonly PlayerId[],
  readonly TerraformingMarsProductId[],
  boolean,
  boolean,
  boolean,
  boolean
>): JSX.Element {
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
          isColonies!,
          isTurmoil!
        )
      ),
    [available, isColonies, isCorporateEra, isTurmoil, isVenus, playerIds]
  );

  const inactiveDecks = useMemo(
    () => Dict.select_keys(Decks, Vec.diff(available, decksInUse)),
    [available, decksInUse]
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
                      <em>
                        <strong>{name}</strong> projects
                      </em>
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
