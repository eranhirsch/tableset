import { Box, Chip } from "@mui/material";
import { useAppSelector } from "app/hooks";
import avro from "avsc";
import { $, Dict, MathUtils, nullthrows, Random, Vec } from "common";
import { allProductIdsSelector } from "features/collection/collectionSlice";
import { gameSelector } from "features/game/gameSlice";
import { playersSelectors } from "features/players/playersSlice";
import {
  templateSelectors,
  templateValue
} from "features/template/templateSlice";
import { useFeaturesContext } from "features/useFeaturesContext";
import createConstantValueMetaStep from "games/core/steps/createConstantValueMetaStep";
import {
  ConfigPanelProps,
  createRandomGameStep,
  InstanceCardsProps,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { Query } from "games/core/steps/Query";
import { AbbreviatedList } from "games/core/ux/AbbreviatedList";
import { ProductId, StepId } from "model/Game";
import { PlayerId } from "model/Player";
import { VariableGameStep } from "model/VariableGameStep";
import { useMemo } from "react";
import { ColorFunction, LabelFunction, ProductsFunction } from "../types";
import {
  AlwaysNeverMultiChipSelector,
  AlwaysNeverMultiLabel,
  Limits,
} from "../ux/AlwaysNeverMultiChipSelector";
import { SingleItemSelect } from "../ux/SingleItemSelect";
import createPlayerAssignmentStep from "./createPlayerAssignmentStep";
import playersMetaStep from "./playersMetaStep";

type TemplateConfig<ItemId extends string | number> = {
  always: readonly ItemId[];
  never: readonly ItemId[];
};

type CountFunction = (playerCount: number) => number;
const DEFAULT_COUNT_FUNCTION: CountFunction = () => 1;

type Variant = "select" | "chips";
const DEFAULT_VARIANT: Variant = "chips";

type AdvancedMode = {
  enabler: VariableGameStep<boolean>;
  count: CountFunction;
};

interface Options<ItemId extends string | number, Pid extends ProductId> {
  // Required
  productsMetaStep: VariableGameStep<readonly Pid[]>;
  availableForProducts: ProductsFunction<ItemId, Pid>;
  labelForId: LabelFunction<ItemId>;
  isItemType(x: unknown): x is ItemId;
  itemAvroType: avro.schema.DefinedType;

  // Optional
  /**
   * Control chip colors in the selector (only relevant for variant='chips')
   */
  getColor?: ColorFunction<ItemId>;

  /**
   * How many items would be selected from the set
   * @param playerCount - number of players in the current template
   * @default 1
   */
  count?: CountFunction;

  /**
   * A boolean step (usually a variant) which enables using this step. When the
   * step is false this step would be entirely skipped.
   * @default alwaysTrue
   */
  enabler?: VariableGameStep<boolean>;

  /**
   * Use this method to supply a different label for items when shown in the
   * TLDR section. Use this if your items are too long.
   */
  labelForIdTLDR?: LabelFunction<ItemId>;

  /**
   * Change the selector UX. `chips` is good for short item labels, and provides
   * a better ux by allowing both `always` and `never` settings to be defined;
   * `select` is good for longer labels which can't be trivially shortened, and
   * doesn't provide `always` settings (just `never`).
   * @default `chips`
   */
  variant?: Variant;

  /**
   * Allow an additional enabler and count that represent an "advanced" mode for
   * the step (for example, supporting both a global count, and a per-player
   * count)
   * @see `enabler`
   * @see `count`
   */
  advancedMode?: AdvancedMode;

  // Required fields for createRandomGameStep
  id: StepId;
  InstanceCards(
    props: InstanceCardsProps<
      readonly ItemId[],
      readonly PlayerId[],
      readonly Pid[],
      boolean,
      boolean
    >
  ): JSX.Element | null;
  InstanceVariableComponent(
    props: VariableStepInstanceComponentProps<readonly ItemId[]>
  ): JSX.Element;

  // Optional fields for createRandomGameStep
  InstanceManualComponent?(): JSX.Element;
  labelOverride?: string;
}

/**
 * We extract addition API methods to allow re-using the options for this step
 * when creating a matching assignment step for the items generated here
 */
interface AdditionalApiMethods {
  createAssignmentStep(
    options: Omit<
      Parameters<typeof createPlayerAssignmentStep>[0],
      // These are taken from the items step options
      | "itemsStep"
      | "availableForProducts"
      | "productsMetaStep"
      | "getColor"
      | "labelForId"
    >
  ): VariableGameStep<readonly PlayerId[]>;
}

export default function createItemSelectorStep<
  ItemId extends string | number,
  Pid extends ProductId
>({
  advancedMode,
  availableForProducts,
  count = DEFAULT_COUNT_FUNCTION,
  enabler,
  getColor,
  isItemType,
  itemAvroType,
  labelForId,
  labelForIdTLDR,
  productsMetaStep,
  variant = DEFAULT_VARIANT,
  ...randomGameStepOptions
}: Options<ItemId, Pid>): VariableGameStep<readonly ItemId[]> &
  AdditionalApiMethods {
  const itemsStep = createRandomGameStep({
    ...randomGameStepOptions,

    dependencies: [
      playersMetaStep,
      productsMetaStep,
      enabler ?? createConstantValueMetaStep(true),
      advancedMode?.enabler ?? createConstantValueMetaStep(false),
    ],

    isTemplatable: (_players, products, isOn, _isAdvancedOn) =>
      isOn.canResolveTo(true) &&
      !Vec.is_empty(availableForProducts(products.onlyResolvableValue()!)),

    isType: (x: unknown): x is readonly ItemId[] =>
      Array.isArray(x) && x.every(isItemType),

    initialConfig: { always: [], never: [] },

    resolve: (...args) =>
      resolve(count, advancedMode?.count, availableForProducts, ...args),

    refresh: (current, players, products, _isOn, isAdvancedOn) =>
      refresh(
        current,
        availableForProducts(products.onlyResolvableValue()!),
        players.onlyResolvableValue()!.length,
        count,
        advancedMode?.count,
        isAdvancedOn
      ),

    skip: (_value, [_playerIds, _productIds, isOn]) => !isOn,

    ConfigPanel: (
      props: ConfigPanelProps<
        TemplateConfig<ItemId>,
        readonly PlayerId[],
        readonly Pid[],
        boolean,
        boolean
      >
    ) => (
      <ConfigPanel
        {...props}
        variant={variant}
        getColor={getColor}
        count={count}
        advancedModeCount={advancedMode?.count}
        availableForProducts={availableForProducts}
        labelForId={labelForId}
      />
    ),
    ConfigPanelTLDR: (props) => (
      <ConfigPanelTLDR
        {...props}
        variant={variant}
        getColor={getColor}
        count={count}
        availableForProducts={availableForProducts}
        labelForId={labelForIdTLDR ?? labelForId}
        advancedMode={advancedMode}
      />
    ),

    willContain: (value, config, playerIds) =>
      willContain(
        value,
        config,
        count(playerIds.onlyResolvableValue()!.length)
      ),

    instanceAvroType: { type: "array", items: itemAvroType },
  });

  const additionalApiMethods: AdditionalApiMethods = {
    createAssignmentStep: (options) =>
      createPlayerAssignmentStep({
        itemsStep,
        availableForProducts,
        productsMetaStep,
        getColor,
        labelForId,
        ...options,
      }),
  };

  // We use assign (and not a regular spread like we usually do to *immutable*
  // objects because we actually need to MUTATE this object so that it remains
  // the same as the one we feed into the assignment step via the `itemStep`
  // option
  return Object.assign(itemsStep, additionalApiMethods);
}

function resolve<ItemId extends string | number, Pid extends ProductId>(
  count: CountFunction,
  advancedModeCount: CountFunction | undefined,
  availableForProducts: ProductsFunction<ItemId, Pid>,
  { always, never }: Readonly<TemplateConfig<ItemId>>,
  playerIds: readonly PlayerId[] | null,
  productIds: readonly Pid[] | null,
  isOn: boolean | null,
  isAdvancedOn: boolean | null,
  // Just so we can use the spread operator above when sending the params to
  // this method
  ..._: unknown[]
): readonly ItemId[] | null {
  if (!isOn) {
    return null;
  }

  const actualCount = (
    isAdvancedOn
      ? nullthrows(
          advancedModeCount,
          `Advanced mode is on but missing advancedMode count method!`
        )
      : count
  )(playerIds!.length);

  // TODO: We return the actual array of items here, but we should be
  // able to return a hash of the combination, we need to extend the
  // query interface a bit to make that possible
  return $(
    always.length === actualCount
      ? always
      : $(
          availableForProducts(productIds!),
          ($$) => Vec.diff($$, always),
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
  playerCount: number,
  count: CountFunction,
  advancedModeCount: CountFunction | undefined,
  isAdvancedOn: Query<boolean>
): Readonly<TemplateConfig<ItemId>> {
  if (!Vec.is_contained_in(always, available)) {
    // If the template has a hard-constraint on a specific item that isn't
    // available anymore we can't simply drop it
    templateValue("unfixable");
  }

  const { min: minRemaining, max: maxAlways } = getLimits(
    isAdvancedOn,
    count,
    advancedModeCount,
    playerCount
  );

  if (always.length > maxAlways) {
    // There are more items then the actual count, we will need to select
    // amongst them, meaning they won't always be part of the results...
    templateValue("unfixable");
  }

  if (Vec.is_contained_in(never, available)) {
    templateValue(
      available.length - never.length < minRemaining
        ? // There are too many items in the never array, we won't be able
          // to fulfil the count constraint.
          "unfixable"
        : // we don't need to remove anything from the never array
          "unchanged"
    );
  }

  const newNever = Vec.intersect(never, available);
  if (available.length - newNever.length < minRemaining) {
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
  queries: [players, products, _isOn, isAdvancedOn],
  variant,
  getColor,
  count,
  advancedModeCount,
  onChange,
  availableForProducts,
  labelForId,
}: ConfigPanelProps<
  TemplateConfig<ItemId>,
  readonly PlayerId[],
  readonly Pid[],
  boolean,
  boolean
> & {
  variant: Variant;
  getColor?: ColorFunction<ItemId>;
  count: CountFunction;
  advancedModeCount?: CountFunction;
  availableForProducts: ProductsFunction<ItemId, Pid>;
  labelForId: LabelFunction<ItemId>;
}): JSX.Element {
  const available = useMemo(
    () => availableForProducts(products.onlyResolvableValue()!),
    [availableForProducts, products]
  );
  const items = useMemo(
    () => Dict.from_keys(available, (itemId) => !never.includes(itemId)),
    [available, never]
  );

  const limits = useMemo(
    () =>
      getLimits(
        isAdvancedOn,
        count,
        advancedModeCount,
        players.onlyResolvableValue()!.length
      ),
    [advancedModeCount, count, isAdvancedOn, players]
  );

  return (
    <Box width="100%">
      {variant === "chips" ? (
        <AlwaysNeverMultiChipSelector
          itemIds={available}
          getLabel={labelForId}
          getColor={getColor}
          limits={limits}
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
  getColor,
  count,
  variant,
  labelForId,
  availableForProducts,
  advancedMode,
}: {
  config: Readonly<TemplateConfig<ItemId>>;
  getColor?: ColorFunction<ItemId>;
  count: CountFunction;
  variant: Variant;
  labelForId: LabelFunction<ItemId>;
  availableForProducts: ProductsFunction<ItemId, Pid>;
  advancedMode?: AdvancedMode;
}): JSX.Element {
  const game = useAppSelector(gameSelector);
  const productIds = useAppSelector(
    allProductIdsSelector(game)
  ) as readonly Pid[];
  const playerCount = useAppSelector(playersSelectors.selectTotal);

  const context = useFeaturesContext();
  const template = useAppSelector(templateSelectors.selectEntities);

  const isAdvancedOn = advancedMode?.enabler.query(template, context);

  const allowed = useMemo(
    () => Vec.diff(availableForProducts(productIds), never),
    [availableForProducts, never, productIds]
  );

  const limits = useMemo(
    () => getLimits(isAdvancedOn, count, advancedMode?.count, playerCount),
    [advancedMode?.count, count, isAdvancedOn, playerCount]
  );

  if (variant === "chips") {
    return (
      <AlwaysNeverMultiLabel
        value={{ always, never }}
        getLabel={labelForId}
        getColor={getColor}
        limits={limits}
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
          getColor != null ? (
            <Chip
              size="small"
              color={getColor(itemId)}
              label={labelForId(itemId)}
            />
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
          getColor != null ? (
            <Chip
              size="small"
              color={getColor(itemId)}
              label={labelForId(itemId)}
            />
          ) : (
            <em>{labelForId(itemId)}</em>
          )
        )}
      </AbbreviatedList>
    </>
  );
}

function getLimits(
  isAdvancedOn: Query<boolean> | undefined,
  basicCountFunc: CountFunction,
  advancedCountFunc: CountFunction | undefined,
  playerCount: number
): Limits {
  if (isAdvancedOn == null) {
    const basicCount = basicCountFunc(playerCount);
    return { min: basicCount, max: basicCount };
  }

  const basicCount = isAdvancedOn.canResolveTo(false)
    ? basicCountFunc(playerCount)
    : null;
  const advancedCount = isAdvancedOn.canResolveTo(true)
    ? nullthrows(
        advancedCountFunc,
        `Missing count method for advanced mode!`
      )(playerCount)
    : null;

  return $(
    [basicCount, advancedCount],
    Vec.filter_nulls,
    $.invariant(
      ($$) => !Vec.is_empty($$),
      `Couldn't compute min from ${basicCount} and ${advancedCount}, are they both null?`
    ),
    // We can only support the minimum of both counts as the max (for `always`),
    // otherwise we would need to select amongst them (which would defy
    // `always`); similarly the min (for the remaining) is the max of the two
    // counts, as we need at least that many items to pick from.
    ($$) => ({ min: MathUtils.max($$)!, max: MathUtils.min($$)! })
  );
}
