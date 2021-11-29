import { Box, Chip } from "@mui/material";
import { useAppSelector } from "app/hooks";
import avro from "avsc";
import { $, Dict, Random, Vec } from "common";
import { allProductIdsSelector } from "features/collection/collectionSlice";
import { gameSelector } from "features/game/gameSlice";
import { playersSelectors } from "features/players/playersSlice";
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

type CountFunction = (playerCount: number) => number;
const DEFAULT_COUNT_FUNCTION: CountFunction = () => 1;

type ColorFunction<ItemId extends string | number> = (
  itemId: ItemId
) => GamePiecesColor;

type ProductsFunction<ItemId extends string | number, Pid extends ProductId> = (
  productIds: readonly Pid[]
) => readonly ItemId[];

type LabelFunction<ItemId extends string | number> = (itemId: ItemId) => string;

type Variant = "select" | "chips";
const DEFAULT_VARIANT: Variant = "chips";

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
  color?: ColorFunction<ItemId>;

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

  // Required fields for createRandomGameStep
  id: StepId;
  InstanceCards(
    props: InstanceCardsProps<
      readonly ItemId[],
      readonly PlayerId[],
      readonly Pid[],
      boolean
    >
  ): JSX.Element | null;
  InstanceManualComponent(): JSX.Element;
  InstanceVariableComponent(
    props: VariableStepInstanceComponentProps<readonly ItemId[]>
  ): JSX.Element;

  // Optional fields for createRandomGameStep
  labelOverride?: string;
}

const createTrivialItemSelector = <
  ItemId extends string | number,
  Pid extends ProductId
>({
  availableForProducts,
  color,
  count = DEFAULT_COUNT_FUNCTION,
  enabler,
  isItemType,
  itemAvroType,
  labelForId,
  labelForIdTLDR,
  productsMetaStep,
  variant = DEFAULT_VARIANT,
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
        count(players.onlyResolvableValue()!.length)
      ),

    skip: (_value, [_playerIds, _productIds, isOn]) => !isOn,

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
        count={count}
        availableForProducts={availableForProducts}
        labelForId={labelForId}
      />
    ),
    ConfigPanelTLDR: (props) => (
      <ConfigPanelTLDR
        {...props}
        variant={variant}
        color={color}
        count={count}
        availableForProducts={availableForProducts}
        labelForId={labelForIdTLDR ?? labelForId}
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
export default createTrivialItemSelector;

function resolve<ItemId extends string | number, Pid extends ProductId>(
  count: CountFunction,
  availableForProducts: ProductsFunction<ItemId, Pid>,
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

  const actualCount = count(playerIds!.length);

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
  queries: [players, products],
  variant,
  color,
  count,
  onChange,
  availableForProducts,
  labelForId,
}: ConfigPanelProps<
  TemplateConfig<ItemId>,
  readonly PlayerId[],
  readonly Pid[],
  boolean
> & {
  variant: Variant;
  color?: ColorFunction<ItemId>;
  count: CountFunction;
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

  const limits = useMemo(() => {
    const actualCount = count(players.onlyResolvableValue()!.length);
    return { min: actualCount, max: actualCount };
  }, [count, players]);

  return (
    <Box width="100%">
      {variant === "chips" ? (
        <AlwaysNeverMultiChipSelector
          itemIds={available}
          getLabel={labelForId}
          getColor={
            color != null
              ? typeof color === "function"
                ? color
                : () => color
              : undefined
          }
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
  color,
  count,
  variant,
  labelForId,
  availableForProducts,
}: {
  config: Readonly<TemplateConfig<ItemId>>;
  color?: ColorFunction<ItemId>;
  count: CountFunction;
  variant: Variant;
  labelForId: LabelFunction<ItemId>;
  availableForProducts: ProductsFunction<ItemId, Pid>;
}): JSX.Element {
  const game = useAppSelector(gameSelector);
  const productIds = useAppSelector(
    allProductIdsSelector(game)
  ) as readonly Pid[];
  const playerCount = useAppSelector(playersSelectors.selectTotal);

  const allowed = useMemo(
    () => Vec.diff(availableForProducts(productIds), never),
    [availableForProducts, never, productIds]
  );

  const limits = useMemo(() => {
    const actualCount = count(playerCount);
    return { min: actualCount, max: actualCount };
  }, [count, playerCount]);

  if (variant === "chips") {
    return (
      <AlwaysNeverMultiLabel
        value={{ always, never }}
        getLabel={labelForId}
        getColor={
          color != null
            ? typeof color === "function"
              ? color
              : () => color
            : undefined
        }
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
          color != null ? (
            <Chip
              size="small"
              color={color(itemId)}
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
          color != null ? (
            <Chip
              size="small"
              color={color(itemId)}
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
