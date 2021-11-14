import {
  Box,
  Checkbox,
  Divider,
  FormControl,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { C, Random, Shape, Vec } from "common";
import { useRequiredInstanceValue } from "features/instance/useInstanceValue";
import { ConfigPanelProps } from "features/template/Templatable";
import { templateValue } from "features/template/templateSlice";
import {
  createRandomGameStep,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { useMemo } from "react";
import { ScytheProductId } from "../ScytheProductId";
import productsMetaStep from "./productsMetaStep";

const BONUS_TILES = {
  adjEncounters: "Adjacent Encounters",
  adjHomeFactory: "Adjacent to Home Bases or The Factory",
  adjLakes: "Adjacent Lakes",
  adjNoStructures: "Not Adjacent to Other Structures",
  adjSameEncounter: "Adjacent to The Same Encounter",
  adjSameLake: "Adjacent to The Same Lake",
  adjTunnels: "Adjacent Tunnels",
  diamond: "In A Diamond Formation",
  onEncounters: "On Encounters",
  onFarmTundra: "On Farms and Tundras",
  onMountainForest: "On Mountains and Forests",
  onTunnels: "On Tunnels",
  onVillages: "On Villages",
  row: "In A Straight Line",
} as const;
type TileKey = keyof typeof BONUS_TILES;

const TILES_IN_PRODUCTS: Readonly<
  Partial<Record<ScytheProductId, readonly TileKey[]>>
> = {
  base: [
    "adjTunnels",
    "adjLakes",
    "adjEncounters",
    "onTunnels",
    "row",
    "onFarmTundra",
  ],
  modularBoard: [
    "adjHomeFactory",
    "adjSameLake",
    "onVillages",
    "onEncounters",
    "adjNoStructures",
    "diamond",
    "onMountainForest",
    "adjSameEncounter",
  ],
};

type TemplateConfig = { never: readonly TileKey[] };

export default createRandomGameStep({
  id: "structureBonus",
  dependencies: [productsMetaStep],
  isTemplatable: (_) => true,
  initialConfig: (): Readonly<TemplateConfig> => ({ never: [] }),
  resolve: ({ never }, products) =>
    Random.sample(Vec.diff(availableForProducts(products!), never), 1),
  refresh({ never }, products) {
    const available = availableForProducts(products.onlyResolvableValue()!);
    return Vec.contained_in(never, available)
      ? templateValue("unchanged")
      : { never: Vec.diff(never, available) };
  },
  ConfigPanel,
  ConfigPanelTLDR,
  InstanceVariableComponent,
  InstanceManualComponent,
});

interface SpecialItem {
  label: string;
  itemizer(available: readonly TileKey[]): readonly TileKey[];
}
const SPECIAL_ITEMS = {
  __all: { label: "Any", itemizer: (_) => [] } as SpecialItem,
  __none: { label: "None", itemizer: (available) => available } as SpecialItem,
} as const;

function ConfigPanel({
  config: { never },
  queries: [products],
  onChange,
}: ConfigPanelProps<TemplateConfig, readonly ScytheProductId[]>): JSX.Element {
  const available = useMemo(
    () =>
      Vec.sort_by(
        availableForProducts(products.onlyResolvableValue()!),
        (key) => BONUS_TILES[key]
      ),
    [products]
  );

  const isError = never.length === available.length;

  return (
    <Box width="100%" padding={2}>
      <FormControl fullWidth color={isError ? "error" : undefined}>
        <Select
          multiple
          displayEmpty
          value={
            Vec.diff(available, never) as readonly (
              | TileKey
              | keyof typeof SPECIAL_ITEMS
            )[]
          }
          renderValue={() =>
            `${isError ? "Error: " : ""}${
              available.length - never.length
            } Selected`
          }
          onChange={({ target: { value } }) => {
            console.log(value);
            if (typeof value !== "string") {
              const special = C.only(
                Vec.values(
                  Shape.filter_with_keys(SPECIAL_ITEMS, (itemId) =>
                    value.includes(itemId)
                  )
                )
              );
              onChange({
                never: Vec.sort(
                  special?.itemizer(available) ?? Vec.diff(available, value)
                ),
              });
            }
          }}
        >
          {Vec.map_with_key(SPECIAL_ITEMS, (itemId, { label }) => (
            <MenuItem key={itemId} value={itemId}>
              <em>{label}</em>
            </MenuItem>
          ))}
          <Divider />
          {Vec.map(available, (key) => (
            <MenuItem key={key} value={key}>
              <Checkbox checked={!never.includes(key)} />
              {BONUS_TILES[key]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

function ConfigPanelTLDR({
  config: { never },
}: {
  config: Readonly<TemplateConfig>;
}): JSX.Element {
  if (Vec.is_empty(never)) {
    return <>Random</>;
  }

  return (
    <>
      Without{" "}
      <GrammaticalList finalConjunction="or">
        {Vec.concat(
          Vec.map(Random.sample(never, 2), (tileId) => (
            <em>{BONUS_TILES[tileId]}</em>
          )),
          never.length > 2 ? [<>{never.length - 2} other tiles</>] : []
        )}
      </GrammaticalList>
      .
    </>
  );
}

function InstanceVariableComponent({
  value,
}: VariableStepInstanceComponentProps<TileKey>): JSX.Element {
  return (
    <BlockWithFootnotes footnote={<>Near the bottom left corner.</>}>
      {(Footnote) => (
        <>
          Place the{" "}
          <Typography component="span" color="primary">
            <strong>{BONUS_TILES[value]}</strong>
          </Typography>{" "}
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

const availableForProducts = (
  products: readonly ScytheProductId[]
): readonly TileKey[] =>
  Vec.flatten(Vec.values(Shape.select_keys(TILES_IN_PRODUCTS, products)));
