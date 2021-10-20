import { Typography } from "@mui/material";
import { invariant, Vec } from "common";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import { ConcordiaProductId } from "../ConcordiaProductId";
import { MapId, MAPS, mapsForProducts } from "../utils/MAPS";
import { RESOURCE_NAME } from "../utils/resource";
import RomanTitle from "../ux/RomanTitle";
import mapStep from "./mapStep";
import productsMetaStep from "./productsMetaStep";
import wineMarketVariant from "./wineMarketVariant";

export default createDerivedGameStep({
  id: "marketBoard",
  dependencies: [productsMetaStep, mapStep, wineMarketVariant],
  skip: ([products, mapId, isWine]) =>
    !isWine &&
    (mapId == null
      ? Vec.is_empty(mapsWithoutMarket(products!))
      : MAPS[mapId].hasIntegratedCardsMarket ?? false),
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [products, mapId, isWine],
}: DerivedStepInstanceComponentProps<
  readonly ConcordiaProductId[],
  MapId
>): JSX.Element {
  const nearMap = `the market board near the map`;
  const boardSide = (
    <>
      with the side showing prices{" "}
      {isWine ? (
        <>
          in <strong>{RESOURCE_NAME.wine}</strong>
        </>
      ) : (
        <>
          <em>just</em> in <strong>{RESOURCE_NAME.cloth}</strong>
        </>
      )}{" "}
      facing up
    </>
  );
  const ionium = (
    <>
      the market board on top of the map, hiding the <strong>B</strong> cities
      (in Italy)
    </>
  );

  if (mapId == null) {
    return (
      <BlockWithFootnotes
        footnote={
          <GrammaticalList finalConjunction="or">
            {Vec.map(mapsWithoutMarket(products!), (mapId) => MAPS[mapId].name)}
          </GrammaticalList>
        }
      >
        {(Footnote) => (
          <>
            {isWine ? (
              <>
                <em>
                  If the map you are playing on doesn't have a cards market
                  section printed on it
                </em>
                <Footnote /> place {nearMap}; <em>otherwise</em> cover it with
                the board
              </>
            ) : (
              <>
                <em>
                  If the map you are playing on doesn't have a cards market
                  section printed on it
                </em>
                <Footnote />: Place {nearMap}
              </>
            )}
            , {boardSide};{" "}
            <em>
              If playing on the{" "}
              <strong>
                <RomanTitle>{MAPS.ionium.name}</RomanTitle>
              </strong>{" "}
              map and you want to have a tighter game
            </em>{" "}
            place {ionium}
            {!isWine && (
              <>
                ; <em>Otherwise skip this step</em>
              </>
            )}
            .
          </>
        )}
      </BlockWithFootnotes>
    );
  }

  invariant(
    isWine || MAPS[mapId].hasIntegratedCardsMarket == null,
    `The map ${mapId} was expected to not have an integrated cards market but it did, did our skip logic break?`
  );
  return (
    <Typography variant="body1">
      Place{" "}
      {mapId === "ioniumSmall"
        ? ionium
        : MAPS[mapId].hasIntegratedCardsMarket
        ? "the market board on top of the printed market section"
        : nearMap}
      , {boardSide}.
    </Typography>
  );
}

function mapsWithoutMarket(
  products: readonly ConcordiaProductId[]
): readonly MapId[] {
  return Vec.filter(
    mapsForProducts(products),
    (mapId) => MAPS[mapId].hasIntegratedCardsMarket == null
  );
}
