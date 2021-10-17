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

export default createDerivedGameStep({
  id: "marketBoard",
  dependencies: [productsMetaStep, mapStep],
  skip: ([products, mapId]) =>
    mapId == null
      ? Vec.is_empty(mapsWithoutMarket(products!))
      : MAPS[mapId].hasIntegratedCardsMarket ?? false,
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [products, mapId],
}: DerivedStepInstanceComponentProps<
  readonly ConcordiaProductId[],
  MapId
>): JSX.Element {
  const nearMap = `the market board near the map`;
  const boardSide = `with the side showing prices only in ${RESOURCE_NAME.cloth} facing up`;
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
            <em>
              If the map you are playing on doesn't have a cards market section
              printed on it
              <Footnote />:
            </em>{" "}
            place {nearMap}, {boardSide};{" "}
            <em>
              If playing on the{" "}
              <strong>
                <RomanTitle>{MAPS.ionium.name}</RomanTitle>
              </strong>{" "}
              map and you want to have a tighter game
            </em>
            : place {ionium}; <em>Otherwise skip this step.</em>
          </>
        )}
      </BlockWithFootnotes>
    );
  }

  invariant(
    MAPS[mapId].hasIntegratedCardsMarket == null,
    `The map ${mapId} was expected to not have an integrated cards market but it did, did our skip logic break?`
  );
  return (
    <Typography variant="body1">
      Place {mapId === "ioniumSmall" ? ionium : nearMap}, {boardSide}.
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
