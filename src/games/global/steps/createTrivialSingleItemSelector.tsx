import {
  Box,
  Checkbox,
  Divider,
  FormControl,
  MenuItem,
  Select
} from "@mui/material";
import { C, Random, Shape, Vec } from "common";
import { useRequiredInstanceValue } from "features/instance/useInstanceValue";
import { ConfigPanelProps } from "features/template/Templatable";
import { templateValue } from "features/template/templateSlice";
import {
  createRandomGameStep,
  VariableStepInstanceComponentProps
} from "games/core/steps/createRandomGameStep";
import { AbbreviatedList } from "games/core/ux/AbbreviatedList";
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
  labelOverride?: string;
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

  const isError = never.length === available.length;

  return (
    <Box width="100%" padding={2}>
      <FormControl fullWidth color={isError ? "error" : undefined}>
        {/* <RichSelect
          all={available}
          unselected={never}
          labelForId={labelForId}
          onChange={(unselected) =>
            onChange({ never: Vec.sort_by(unselected, labelForId) })
          }
        /> */}
        <MobileSelect
          all={available}
          unselected={never}
          labelForId={labelForId}
          onChange={(unselected) =>
            onChange({ never: Vec.sort_by(unselected, labelForId) })
          }
        />
      </FormControl>
    </Box>
  );
}

function MobileSelect<ItemId extends string | number>({
  all,
  unselected,
  onChange,
  labelForId,
}: {
  all: readonly ItemId[];
  unselected: readonly ItemId[];
  onChange(unselected: readonly ItemId[]): void;
  labelForId(itemId: ItemId): string;
}): JSX.Element {
  const selected: readonly (ItemId | keyof typeof SPECIAL_ITEMS)[] = useMemo(
    () => Vec.diff(all, unselected),
    [all, unselected]
  );

  return (
    <select
      multiple
      value={selected as readonly string[]}
      onChange={(event) => {
        const target = event.target;
        const selected = Vec.maybe_map(
          [...target.options],
          ({ value, selected }) => (selected ? value : undefined)
        );
        onChange(Vec.diff(all, selected));
      }}
    >
      {Vec.map(all, (itemId) => (
        <option value={itemId}>{labelForId(itemId)}</option>
      ))}
    </select>
  );
}

// TODO: Not really exported, this is currently unused until we add logic to
// pick this or the native impl depending on the user agent.
export function RichSelect<ItemId extends string | number>({
  all,
  unselected,
  labelForId,
  onChange,
}: {
  all: readonly ItemId[];
  unselected: readonly ItemId[];
  labelForId(itemId: ItemId): string;
  onChange(unselected: readonly ItemId[]): void;
}): JSX.Element {
  const selected: readonly (ItemId | keyof typeof SPECIAL_ITEMS)[] = useMemo(
    () => Vec.diff(all, unselected),
    [all, unselected]
  );

  return (
    <Select
      multiple
      displayEmpty
      value={selected}
      renderValue={() =>
        `${unselected.length === all.length ? "Error: " : ""}${
          all.length - unselected.length
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
          onChange(special?.itemizer(all) ?? Vec.diff(all, value));
        }
      }}
    >
      {Vec.map_with_key(SPECIAL_ITEMS, (itemId, { label, itemizer }) => (
        <MenuItem
          key={itemId}
          value={itemId}
          disabled={Vec.equal(itemizer(all), unselected)}
        >
          <em>{label}</em>
        </MenuItem>
      ))}
      <Divider />
      {Vec.map(all, (key) => (
        <MenuItem key={key} value={key}>
          <Checkbox checked={!unselected.includes(key)} />
          {labelForId(key)}
        </MenuItem>
      ))}
    </Select>
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
      <AbbreviatedList finalConjunction="or">
        {Vec.map(allowed, (itemId) => (
          <em>{labelForId(itemId)}</em>
        ))}
      </AbbreviatedList>
    );
  }

  return (
    <>
      Without{" "}
      <AbbreviatedList finalConjunction="or">
        {Vec.map(never, (itemId) => (
          <em>{labelForId(itemId)}</em>
        ))}
      </AbbreviatedList>
    </>
  );
}
