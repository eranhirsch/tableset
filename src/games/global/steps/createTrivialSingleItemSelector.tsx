import { Box, Chip } from "@mui/material";
import { useAppSelector } from "app/hooks";
import avro from "avsc";
import { C, Dict, Random, Vec } from "common";
import { allProductIdsSelector } from "features/collection/collectionSlice";
import { gameSelector } from "features/game/gameSlice";
import { templateValue } from "features/template/templateSlice";
import {
  ConfigPanelProps,
  createRandomGameStep,
  InstanceCardsProps,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { AbbreviatedList } from "games/core/ux/AbbreviatedList";
import { ProductId, StepId } from "model/Game";
import { GamePiecesColor } from "model/GamePiecesColor";
import { VariableGameStep } from "model/VariableGameStep";
import { useMemo } from "react";
import {
  AlwaysNeverMultiChipSelector,
  AlwaysNeverMultiLabel,
} from "../ux/AlwaysNeverMultiChipSelector";
import { SingleItemSelect } from "../ux/SingleItemSelect";
import alwaysOnMetaStep from "./alwaysOnMetaStep";

type TemplateConfig<ItemId extends string | number> = {
  always: readonly ItemId[];
  never: readonly ItemId[];
};

interface Options<ItemId extends string | number, Pid extends ProductId> {
  productsMetaStep: VariableGameStep<readonly Pid[]>;
  enabler?: VariableGameStep<boolean>;
  availableForProducts(productIds: readonly Pid[]): readonly ItemId[];
  labelForId(itemId: ItemId): string;
  variant?: "select" | "chips";
  color?: GamePiecesColor;

  // Required fields for createRandomGameStep
  id: StepId;
  isType(x: unknown): x is ItemId;
  labelOverride?: string;
  InstanceVariableComponent(
    props: VariableStepInstanceComponentProps<ItemId>
  ): JSX.Element;
  InstanceManualComponent(): JSX.Element;
  InstanceCards?(
    props: InstanceCardsProps<ItemId, readonly Pid[], boolean>
  ): JSX.Element;
  instanceAvroType: avro.schema.DefinedType;
}

const createTrivialSingleItemSelector = <
  ItemId extends string | number,
  Pid extends ProductId
>({
  availableForProducts,
  labelForId,
  productsMetaStep,
  enabler: variantStep,
  variant = "chips",
  color,
  ...randomGameStepOptions
}: Options<ItemId, Pid>) =>
  createRandomGameStep({
    ...randomGameStepOptions,

    dependencies: [productsMetaStep, variantStep ?? alwaysOnMetaStep],

    isTemplatable: (products, isOn) =>
      isOn.canResolveTo(true) &&
      !Vec.is_empty(availableForProducts(products.onlyResolvableValue()!)),

    initialConfig: { always: [], never: [] },

    resolve: ({ always, never }, products, isOn) =>
      isOn
        ? Vec.is_empty(always)
          ? Random.sample(Vec.diff(availableForProducts(products!), never), 1)
          : C.onlyx(always)
        : null,

    refresh({ always, never }, products) {
      const available = availableForProducts(products.onlyResolvableValue()!);
      const allValidNever = Vec.contained_in(never, available);
      const allValidAlways = Vec.contained_in(always, available);
      return allValidNever && allValidAlways
        ? templateValue("unchanged")
        : {
            always: allValidAlways ? always : Vec.intersect(always, available),
            never: allValidNever ? never : Vec.intersect(never, available),
          };
    },

    skip: (_, [productIds, isOn]) =>
      !isOn || Vec.is_empty(availableForProducts(productIds!)),

    ConfigPanel: (
      props: ConfigPanelProps<TemplateConfig<ItemId>, readonly Pid[], boolean>
    ) => (
      <ConfigPanel
        {...props}
        variant={variant}
        color={color}
        availableForProducts={availableForProducts}
        labelForId={labelForId}
      />
    ),
    ConfigPanelTLDR: (props) => (
      <ConfigPanelTLDR
        {...props}
        variant={variant}
        color={color}
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

function ConfigPanel<ItemId extends string | number, Pid extends ProductId>({
  config: { always, never },
  queries: [products],
  variant,
  color,
  onChange,
  availableForProducts,
  labelForId,
}: ConfigPanelProps<TemplateConfig<ItemId>, readonly Pid[], boolean> & {
  variant: "select" | "chips";
  color?: GamePiecesColor;
  availableForProducts(productIds: readonly Pid[]): readonly ItemId[];
  labelForId(itemId: ItemId): string;
}): JSX.Element {
  const available = useMemo(
    () => availableForProducts(products.onlyResolvableValue()!),
    [availableForProducts, products]
  );
  const items = useMemo(
    () => Dict.from_keys(available, (itemId) => !never.includes(itemId)),
    [available, never]
  );

  return (
    <Box width="100%">
      {variant === "chips" ? (
        <AlwaysNeverMultiChipSelector
          itemIds={available}
          getLabel={labelForId}
          getColor={color != null ? () => color : undefined}
          limits={{
            min: 1,
            max: 1,
          }}
          value={{ always, never }}
          onChange={(changedFunc) =>
            onChange((current) => changedFunc(current))
          }
        />
      ) : (
        <SingleItemSelect
          items={items}
          labelForId={labelForId}
          onChange={(unselected) =>
            onChange(({ always }) => ({
              always,
              never: Vec.sort_by(unselected, labelForId),
            }))
          }
        />
      )}
    </Box>
  );
}

function ConfigPanelTLDR<
  ItemId extends string | number,
  Pid extends ProductId
>({
  config: { always, never },
  color,
  variant,
  labelForId,
  availableForProducts,
}: {
  config: Readonly<TemplateConfig<ItemId>>;
  color?: GamePiecesColor;
  variant: "select" | "chips";
  labelForId(itemId: ItemId): string;
  availableForProducts(productIds: readonly Pid[]): readonly ItemId[];
}): JSX.Element {
  const game = useAppSelector(gameSelector);
  const productIds = useAppSelector(
    allProductIdsSelector(game)
  ) as readonly Pid[];

  const allowed = useMemo(
    () => Vec.diff(availableForProducts(productIds), never),
    [availableForProducts, never, productIds]
  );

  if (variant === "chips") {
    return (
      <AlwaysNeverMultiLabel
        value={{ always, never }}
        getLabel={labelForId}
        getColor={color != null ? () => color : undefined}
        limits={{ min: 1, max: 1 }}
      />
    );
  }

  if (Vec.is_empty(never)) {
    return <>Random</>;
  }

  if (allowed.length <= never.length) {
    return (
      <AbbreviatedList finalConjunction="or">
        {Vec.map(allowed, (itemId) =>
          color != null ? (
            <Chip size="small" color={color} label={labelForId(itemId)} />
          ) : (
            <em>{labelForId(itemId)}</em>
          )
        )}
      </AbbreviatedList>
    );
  }

  return (
    <>
      Without{" "}
      <AbbreviatedList finalConjunction="or">
        {Vec.map(never, (itemId) =>
          color != null ? (
            <Chip size="small" color={color} label={labelForId(itemId)} />
          ) : (
            <em>{labelForId(itemId)}</em>
          )
        )}
      </AbbreviatedList>
    </>
  );
}
