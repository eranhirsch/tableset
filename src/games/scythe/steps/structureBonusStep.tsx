import { Box, FormControl, MenuItem, Select, Typography } from "@mui/material";
import { Shape, Vec } from "common";
import { useRequiredInstanceValue } from "features/instance/useInstanceValue";
import { ConfigPanelProps } from "features/template/Templatable";
import { templateValue } from "features/template/templateSlice";
import {
  createRandomGameStep,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
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

type TemplateConfig = { fixed?: keyof typeof BONUS_TILES };

export default createRandomGameStep({
  id: "structureBonus",
  dependencies: [productsMetaStep],
  isTemplatable: (_) => true,
  initialConfig: (): Readonly<TemplateConfig> => ({}),
  resolve: (config, products) =>
    config?.fixed ?? Vec.sample(availableForProducts(products!), 1),
  refresh: (config, products) =>
    templateValue(
      config.fixed == null ||
        availableForProducts(products.onlyResolvableValue()!).includes(
          config.fixed
        )
        ? "unchanged"
        : "unfixable"
    ),
  ConfigPanel,
  ConfigPanelTLDR,
  InstanceVariableComponent,
  InstanceManualComponent,
});

function ConfigPanel({
  config,
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
  return (
    <Box width="100%" padding={2}>
      <FormControl fullWidth>
        <Select
          value={config.fixed ?? ""}
          displayEmpty
          onChange={({ target: { value } }) =>
            onChange(value === "" ? {} : { fixed: value as TileKey })
          }
        >
          <MenuItem value="">
            <em>Any</em>
          </MenuItem>
          {Vec.map(available, (key) => (
            <MenuItem key={key} value={key}>
              {BONUS_TILES[key]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

function ConfigPanelTLDR({
  config,
}: {
  config: Readonly<TemplateConfig>;
}): JSX.Element {
  return <>{config.fixed == null ? "Random" : BONUS_TILES[config.fixed]}</>;
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
