import {
  Box,
  Checkbox,
  Divider,
  FormControl,
  MenuItem,
  Select,
} from "@mui/material";
import { C, Random, Shape, Vec } from "common";
import { ConfigPanelProps } from "features/template/Templatable";
import { templateValue } from "features/template/templateSlice";
import {
  createRandomGameStep,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { Query } from "games/core/steps/Query";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import { ProductId, StepId } from "model/Game";
import { VariableGameStep } from "model/VariableGameStep";
import { useMemo } from "react";

type TemplateConfig<ItemId extends string> = { never: readonly ItemId[] };

interface Options<ItemId extends string, Pid extends ProductId> {
  id: StepId;
  productsMetaStep: VariableGameStep<readonly Pid[]>;
  isTemplatable(products: Query<readonly Pid[]>): boolean;
  availableForProducts(productIds: readonly Pid[]): readonly ItemId[];
  labelForId(itemId: ItemId): string;
  InstanceVariableComponent(
    props: VariableStepInstanceComponentProps<ItemId>
  ): JSX.Element;
  InstanceManualComponent(): JSX.Element;
}

const createTrivialSingleItemSelector = <
  ItemId extends string,
  Pid extends ProductId
>({
  id,
  productsMetaStep,
  isTemplatable,
  availableForProducts,
  labelForId,
  InstanceVariableComponent,
  InstanceManualComponent,
}: Options<ItemId, Pid>) =>
  createRandomGameStep({
    id,
    dependencies: [productsMetaStep],
    isTemplatable,
    initialConfig: (): Readonly<TemplateConfig<ItemId>> => ({ never: [] }),
    resolve: ({ never }, products) =>
      Random.sample(Vec.diff(availableForProducts(products!), never), 1),
    refresh({ never }, products) {
      const available = availableForProducts(products.onlyResolvableValue()!);
      return Vec.contained_in(never, available)
        ? templateValue("unchanged")
        : { never: Vec.intersect(never, available) };
    },
    ConfigPanel: (props) => (
      <ConfigPanel
        {...props}
        availableForProducts={availableForProducts}
        labelForId={labelForId}
      />
    ),
    ConfigPanelTLDR: (props) => (
      <ConfigPanelTLDR {...props} labelForId={labelForId} />
    ),
    InstanceVariableComponent,
    InstanceManualComponent,
  });
export default createTrivialSingleItemSelector;

interface SpecialItem {
  label: string;
  itemizer<ItemId extends string>(
    available: readonly ItemId[]
  ): readonly ItemId[];
}
const SPECIAL_ITEMS = {
  __all: { label: "Any", itemizer: (_) => [] } as SpecialItem,
  __none: { label: "None", itemizer: (available) => available } as SpecialItem,
} as const;

function ConfigPanel<ItemId extends string, Pid extends ProductId>({
  config: { never },
  queries: [products],
  onChange,
  availableForProducts,
  labelForId,
}: ConfigPanelProps<TemplateConfig<ItemId>, readonly Pid[]> & {
  availableForProducts(productIds: readonly Pid[]): readonly ItemId[];
  labelForId(itemId: ItemId): string;
}): JSX.Element {
  const available = useMemo(
    () =>
      Vec.sort_by(
        availableForProducts(products.onlyResolvableValue()!),
        labelForId
      ),
    [availableForProducts, labelForId, products]
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
              | ItemId
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
              {labelForId(key)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

function ConfigPanelTLDR<ItemId extends string>({
  config: { never },
  labelForId,
}: {
  config: Readonly<TemplateConfig<ItemId>>;
  labelForId(itemId: ItemId): string;
}): JSX.Element {
  if (Vec.is_empty(never)) {
    return <>Random</>;
  }

  return (
    <>
      Without{" "}
      <GrammaticalList finalConjunction="or">
        {Vec.concat(
          Vec.map(Random.sample(never, 2), (itemId) => (
            <em>{labelForId(itemId)}</em>
          )),
          never.length > 2 ? [<>{never.length - 2} other items</>] : []
        )}
      </GrammaticalList>
      .
    </>
  );
}
