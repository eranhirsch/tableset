import { Box, Chip } from "@mui/material";
import { useAppSelector } from "app/hooks";
import avro from "avsc";
import { $, Dict, Random, Vec } from "common";
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
import { PlayerId } from "model/Player";
import { VariableGameStep } from "model/VariableGameStep";
import { useMemo } from "react";
import {
  AlwaysNeverMultiChipSelector,
  AlwaysNeverMultiLabel,
} from "../ux/AlwaysNeverMultiChipSelector";
import { SingleItemSelect } from "../ux/SingleItemSelect";
import alwaysOnMetaStep from "./alwaysOnMetaStep";
import playersMetaStep from "./playersMetaStep";

type TemplateConfig<ItemId extends string | number> = {
  always: readonly ItemId[];
  never: readonly ItemId[];
};

interface Options<ItemId extends string | number, Pid extends ProductId> {
  productsMetaStep: VariableGameStep<readonly Pid[]>;
  enabler?: VariableGameStep<boolean>;
  count?: number | ((playerCount: number) => number);
  availableForProducts(productIds: readonly Pid[]): readonly ItemId[];
  labelForId(itemId: ItemId): string;
  variant?: "select" | "chips";
  color?: GamePiecesColor;
  isItemType(x: unknown): x is ItemId;
  itemAvroType: avro.schema.DefinedType;

  // Required fields for createRandomGameStep
  id: StepId;
  labelOverride?: string;
  InstanceVariableComponent(
    props: VariableStepInstanceComponentProps<readonly ItemId[]>
  ): JSX.Element;
  InstanceManualComponent(): JSX.Element;
  InstanceCards?(
    props: InstanceCardsProps<
      readonly ItemId[],
      readonly PlayerId[],
      readonly Pid[],
      boolean
    >
  ): JSX.Element;
}

const createTrivialSingleItemSelector = <
  ItemId extends string | number,
  Pid extends ProductId
>({
  availableForProducts,
  color,
  count = 1,
  enabler,
  isItemType,
  itemAvroType,
  labelForId,
  productsMetaStep,
  variant = "chips",
  ...randomGameStepOptions
}: Options<ItemId, Pid>) =>
  createRandomGameStep({
    ...randomGameStepOptions,

    dependencies: [
      playersMetaStep,
      productsMetaStep,
      enabler ?? alwaysOnMetaStep,
    ],

    isTemplatable: (_players, products, isOn) =>
      isOn.canResolveTo(true) &&
      !Vec.is_empty(availableForProducts(products.onlyResolvableValue()!)),

    isType: (x: unknown): x is readonly ItemId[] =>
      Array.isArray(x) && x.every(isItemType),

    initialConfig: { always: [], never: [] },

    resolve: (...args) => resolve(count, availableForProducts, ...args),

    refresh: (current, players, products) =>
      refresh(
        current,
        availableForProducts(products.onlyResolvableValue()!),
        typeof count === "number" ? count : count(players.count())
      ),

    skip: (_value, [_productIds, isOn]) => !isOn,

    ConfigPanel: (
      props: ConfigPanelProps<
        TemplateConfig<ItemId>,
        readonly PlayerId[],
        readonly Pid[],
        boolean
      >
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

    willContain: (value, config, playerIds) =>
      willContain(
        value,
        config,
        typeof count === "number" ? count : count(playerIds.count())
      ),

    instanceAvroType: { type: "array", items: itemAvroType },
  });
export default createTrivialSingleItemSelector;

function resolve<ItemId extends string | number, Pid extends ProductId>(
  count: number | ((playerCount: number) => number),
  availableForProducts: (productIds: readonly Pid[]) => readonly ItemId[],
  { always, never }: Readonly<TemplateConfig<ItemId>>,
  playerIds: readonly PlayerId[] | null,
  productIds: readonly Pid[] | null,
  isOn: boolean | null,
  // Just so we can use the spread operator above when sending the params to
  // this method
  ..._: unknown[]
): readonly ItemId[] | null {
  if (!isOn) {
    return null;
  }

  const actualCount =
    typeof count === "number" ? count : count(playerIds!.length);

  // TODO: We return the actual array of items here, but we should be
  // able to return a hash of the combination, we need to extend the
  // query interface a bit to make that possible
  return $(
    always.length === actualCount
      ? always
      : $(
          availableForProducts(productIds!),
          ($$) => Vec.diff($$, never),
          ($$) => Random.sample($$, actualCount - always.length),
          ($$) => Vec.concat(always, $$)
        ),
    Vec.sort
  );
}

function refresh<ItemId extends string | number>(
  { always, never }: Readonly<TemplateConfig<ItemId>>,
  available: readonly ItemId[],
  count: number
): Readonly<TemplateConfig<ItemId>> {
  if (!Vec.contained_in(always, available)) {
    // If the template has a hard-constraint on a specific item that isn't
    // available anymore we can't simply drop it
    templateValue("unfixable");
  }

  if (always.length >= count) {
    // There are more items then the actual count, we will need to select
    // amongst them, meaning they won't always be part of the results...
    templateValue("unfixable");
  }

  if (Vec.contained_in(never, available)) {
    templateValue(
      available.length - never.length >= count
        ? // we don't need to remove anything from the never array
          "unchanged"
        : // There are too many items in the never array, we won't be able
          // to fulfil the count constraint.
          "unfixable"
    );
  }

  const newNever = Vec.intersect(never, available);
  if (available.length - newNever.length < count) {
    // There are too many items in the never array, we won't be able to
    // fulfil the count constraint.
    templateValue("unfixable");
  }

  return { always, never: newNever };
}

function willContain<ItemId extends string | number>(
  value: ItemId,
  config: Readonly<TemplateConfig<ItemId>> | null,
  count: number
): boolean | undefined {
  if (config == null) {
    // No config, won't resolve at all
    // TODO: Maybe we shouldn't even run canResolveTo when configs are null?
    return false;
  }

  if (config.never.includes(value)) {
    // Trivial
    return false;
  }

  if (config.always.includes(value)) {
    // Trivial
    return true;
  }

  if (config.always.length >= count) {
    // We won't have any randomness in the results, if the value isn't
    // already in `always`, it won't come up randomly
    return false;
  }

  // Is the value possible under the current products?
  return undefined;
}

function ConfigPanel<ItemId extends string | number, Pid extends ProductId>({
  config: { always, never },
  queries: [_players, products],
  variant,
  color,
  onChange,
  availableForProducts,
  labelForId,
}: ConfigPanelProps<
  TemplateConfig<ItemId>,
  readonly PlayerId[],
  readonly Pid[],
  boolean
> & {
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
