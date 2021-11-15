import {
  Box,
  Checkbox,
  Divider,
  FormControl,
  MenuItem,
  Select,
} from "@mui/material";
import { C, Random, Shape, Vec } from "common";
import { useRequiredInstanceValue } from "features/instance/useInstanceValue";
import { ConfigPanelProps } from "features/template/Templatable";
import { templateValue } from "features/template/templateSlice";
import {
  createRandomGameStep,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import { ProductId, StepId } from "model/Game";
import { VariableGameStep } from "model/VariableGameStep";
import { useMemo } from "react";
import alwaysOnMetaStep from "./alwaysOnMetaStep";

type TemplateConfig<ItemId extends string | number> = {
  never: readonly ItemId[];
};

interface Options<ItemId extends string | number, Pid extends ProductId> {
  productsMetaStep: VariableGameStep<readonly Pid[]>;
  variantStep?: VariableGameStep<boolean>;
  availableForProducts(productIds: readonly Pid[]): readonly ItemId[];
  labelForId(itemId: ItemId): string;

  // Required fields for createRandomGameStep
  id: StepId;
  InstanceVariableComponent(
    props: VariableStepInstanceComponentProps<ItemId>
  ): JSX.Element;
  InstanceManualComponent(): JSX.Element;
}

const createTrivialSingleItemSelector = <
  ItemId extends string | number,
  Pid extends ProductId
>({
  availableForProducts,
  labelForId,
  productsMetaStep,
  variantStep,
  ...randomGameStepOptions
}: Options<ItemId, Pid>) =>
  createRandomGameStep({
    ...randomGameStepOptions,

    dependencies: [productsMetaStep, variantStep ?? alwaysOnMetaStep],

    isTemplatable: (products, isOn) =>
      isOn.canResolveTo(true) &&
      !Vec.is_empty(availableForProducts(products.onlyResolvableValue()!)),

    initialConfig: (): Readonly<TemplateConfig<ItemId>> => ({ never: [] }),

    resolve: ({ never }, products, isOn) =>
      isOn
        ? Random.sample(Vec.diff(availableForProducts(products!), never), 1)
        : null,

    refresh({ never }, products) {
      const available = availableForProducts(products.onlyResolvableValue()!);
      return Vec.contained_in(never, available)
        ? templateValue("unchanged")
        : { never: Vec.intersect(never, available) };
    },

    skip: (_, [productIds, isOn]) =>
      !isOn || Vec.is_empty(availableForProducts(productIds!)),

    ConfigPanel: (props) => (
      <ConfigPanel
        {...props}
        availableForProducts={availableForProducts}
        labelForId={labelForId}
      />
    ),
    ConfigPanelTLDR: (props) => (
      <ConfigPanelTLDR
        {...props}
        productsMetaStep={productsMetaStep}
        availableForProducts={availableForProducts}
        labelForId={labelForId}
      />
    ),

    canResolveTo: (value, config, productIds) =>
      config != null &&
      !config.never.includes(value) &&
      availableForProducts(productIds.onlyResolvableValue()!).includes(value),
  });
export default createTrivialSingleItemSelector;

interface SpecialItem {
  label: string;
  itemizer<ItemId extends string | number>(
    available: readonly ItemId[]
  ): readonly ItemId[];
}
const SPECIAL_ITEMS = {
  __all: { label: "Select All", itemizer: (_) => [] } as SpecialItem,
  __none: { label: "Clear", itemizer: (available) => available } as SpecialItem,
} as const;

function ConfigPanel<ItemId extends string | number, Pid extends ProductId>({
  config: { never },
  queries: [products],
  onChange,
  availableForProducts,
  labelForId,
}: ConfigPanelProps<TemplateConfig<ItemId>, readonly Pid[], boolean> & {
  availableForProducts(productIds: readonly Pid[]): readonly ItemId[];
  labelForId(itemId: ItemId): string;
}): JSX.Element {
  const available = useMemo(
    () =>
      Vec.sort_by(availableForProducts(products.onlyResolvableValue()!), (id) =>
        labelForId(id)
      ),
    [availableForProducts, labelForId, products]
  );

  const selected: readonly (ItemId | keyof typeof SPECIAL_ITEMS)[] = useMemo(
    () => Vec.diff(available, never),
    [available, never]
  );

  const isError = never.length === available.length;

  return (
    <Box width="100%" padding={2}>
      <FormControl fullWidth color={isError ? "error" : undefined}>
        <Select
          multiple
          displayEmpty
          value={selected}
          renderValue={() =>
            `${isError ? "Error: " : ""}${
              available.length - never.length
            } Selected`
          }
          onChange={({ target: { value } }) => {
            if (typeof value !== "string") {
              const special = C.only(
                Vec.values(
                  Shape.filter_with_keys(SPECIAL_ITEMS, (itemId) =>
                    value.includes(itemId)
                  )
                )
              );
              onChange({
                never: Vec.sort_by(
                  special?.itemizer(available) ?? Vec.diff(available, value),
                  (id) => labelForId(id)
                ),
              });
            }
          }}
        >
          {Vec.map_with_key(SPECIAL_ITEMS, (itemId, { label, itemizer }) => (
            <MenuItem
              key={itemId}
              value={itemId}
              disabled={Vec.equal(itemizer(available), never)}
            >
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

function ConfigPanelTLDR<
  ItemId extends string | number,
  Pid extends ProductId
>({
  config: { never },
  labelForId,
  availableForProducts,
  productsMetaStep,
}: {
  config: Readonly<TemplateConfig<ItemId>>;
  labelForId(itemId: ItemId): string;
  availableForProducts(productIds: readonly Pid[]): readonly ItemId[];
  productsMetaStep: VariableGameStep<readonly Pid[]>;
}): JSX.Element {
  const productIds = useRequiredInstanceValue(productsMetaStep);

  const allowed = useMemo(
    () => Vec.diff(availableForProducts(productIds), never),
    [availableForProducts, never, productIds]
  );

  if (Vec.is_empty(never)) {
    return <>Random</>;
  }

  if (allowed.length <= never.length) {
    return (
      <GrammaticalList finalConjunction="or">
        {Vec.concat(
          Vec.map(Random.sample(allowed, 2), (itemId) => (
            <>{labelForId(itemId)}</>
          )),
          allowed.length > 2
            ? [
                <>
                  {allowed.length - 2} other item{allowed.length > 3 && "s"}
                </>,
              ]
            : []
        )}
      </GrammaticalList>
    );
  }

  return (
    <>
      Without{" "}
      <GrammaticalList finalConjunction="or">
        {Vec.concat(
          Vec.map(Random.sample(never, 2), (itemId) => (
            <em>{labelForId(itemId)}</em>
          )),
          never.length > 2
            ? [
                <>
                  {never.length - 2} other item{never.length > 3 && "s"}
                </>,
              ]
            : []
        )}
      </GrammaticalList>
    </>
  );
}
