import { Typography } from "@mui/material";
import { Shape, Vec } from "common";
import { InstanceCard } from "features/instance/InstanceCard";
import { useRequiredInstanceValue } from "features/instance/useInstanceValue";
import {
  InstanceCardsProps,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { createTrivialItemSelector } from "games/global";
import { useMemo } from "react";
import { ScytheProductId } from "../ScytheProductId";
import productsMetaStep from "./productsMetaStep";

const BONUS_TILES = {
  adjEncounters: "Adjacent Encounters",
  adjLakes: "Adjacent Lakes",
  adjNoStructures: "Not Adjacent to Other Structures",
  adjToHomeFactory: "Adjacent to Home Bases or The Factory",
  adjToSameEncounter: "Adjacent to The Same Encounter",
  adjToSameLake: "Adjacent to The Same Lake",
  adjTunnels: "Adjacent Tunnels",
  inDiamond: "In A Diamond Formation",
  inLine: "In A Straight Line",
  onEncounters: "On Encounters",
  onFarmTundra: "On Farms and Tundras",
  onMountainForest: "On Mountains and Forests",
  onTunnels: "On Tunnels",
  onVillages: "On Villages",
} as const;
type TileKey = keyof typeof BONUS_TILES;

const TILES_IN_PRODUCTS: Readonly<
  Partial<Record<ScytheProductId, readonly TileKey[]>>
> = {
  base: [
    "adjEncounters",
    "adjLakes",
    "adjTunnels",
    "inLine",
    "onFarmTundra",
    "onTunnels",
  ],
  modularBoard: [
    "adjNoStructures",
    "adjToHomeFactory",
    "adjToSameEncounter",
    "adjToSameLake",
    "inDiamond",
    "onEncounters",
    "onMountainForest",
    "onVillages",
  ],
};

export default createTrivialItemSelector({
  id: "structureBonus",

  isItemType: (x: unknown): x is TileKey =>
    typeof x === "string" && BONUS_TILES[x as TileKey] != null,

  productsMetaStep,
  availableForProducts,
  labelForId: (tileId) => BONUS_TILES[tileId],
  InstanceVariableComponent,
  InstanceManualComponent,
  InstanceCards,

  variant: "select",

  itemAvroType: {
    type: "enum",
    name: "TileKey",
    symbols: [...Vec.keys(BONUS_TILES)],
  },
});

function InstanceVariableComponent({
  value: [tileKey],
}: VariableStepInstanceComponentProps<readonly TileKey[]>): JSX.Element {
  return (
    <BlockWithFootnotes footnote={<>Near the bottom left corner.</>}>
      {(Footnote) => (
        <>
          Place the <ChosenElement>{BONUS_TILES[tileKey]}</ChosenElement>{" "}
          <em>Structure Bonus</em> tile on it's designated spot on the board
          <Footnote />.
        </>
      )}
    </BlockWithFootnotes>
  );
}

function InstanceManualComponent(): JSX.Element {
  const products = useRequiredInstanceValue(productsMetaStep);

  const available = useMemo(() => availableForProducts(products), [products]);

  return (
    <HeaderAndSteps synopsis="Assign a structure bonus:">
      <BlockWithFootnotes
        footnote={<>{available.length} small thick white cardboard tiles.</>}
      >
        {(Footnote) => (
          <>
            Shuffle all structure bonus tiles
            <Footnote />.
          </>
        )}
      </BlockWithFootnotes>
      <>
        Draw <strong>1</strong> tile randomly.
      </>
      <BlockWithFootnotes footnote={<>Near the bottom left corner.</>}>
        {(Footnote) => (
          <>
            Put the tile on it's designated spot on the board
            <Footnote />.
          </>
        )}
      </BlockWithFootnotes>
    </HeaderAndSteps>
  );
}

function InstanceCards({
  value: [itemId],
  dependencies: [_productIds],
  onClick,
}: InstanceCardsProps<
  readonly TileKey[],
  readonly ScytheProductId[]
>): JSX.Element {
  return (
    <InstanceCard title="Structure Bonus" onClick={onClick}>
      <Typography variant="subtitle2" color="primary">
        <strong>{BONUS_TILES[itemId]}</strong>
      </Typography>
    </InstanceCard>
  );
}

function availableForProducts(
  products: readonly ScytheProductId[]
): readonly TileKey[] {
  return Vec.flatten(
    Vec.values(Shape.select_keys(TILES_IN_PRODUCTS, products))
  );
}
