import { useAppSelector } from "app/hooks";
import { useRequiredInstanceValue } from "features/instance/useInstanceValue";
import { playersSelectors } from "features/players/playersSlice";
import { createVariant } from "games/core/steps/createVariant";
import { neverResolvesMetaStep, playersMetaStep } from "games/global";
import { VariableGameStep } from "model/VariableGameStep";

interface Options<ProductId = never> {
  productDependencies?: {
    step: Readonly<VariableGameStep<readonly ProductId[]>>;
    products: readonly ProductId[];
  };
  optionalAt?: readonly number[];
  enabledAt?: readonly number[];
  InstanceVariableComponent: () => JSX.Element;
}

export type TeamVariantStep = VariableGameStep<boolean> & {
  useRequiredInstanceValue: () => boolean;
};

export default function createTeamVariant<ProductId = never>({
  productDependencies,
  optionalAt,
  enabledAt,
  InstanceVariableComponent,
}: Options<ProductId>): Readonly<TeamVariantStep> {
  const baseTeamPlayVariant = createVariant({
    id: "teams",
    name: "Teams",
    dependencies: [
      playersMetaStep,
      productDependencies?.step ??
        (neverResolvesMetaStep as VariableGameStep<readonly ProductId[]>),
    ],
    isTemplatable: (players, products) =>
      optionalAt != null &&
      (productDependencies == null ||
        products.willContainAny(productDependencies.products)) &&
      optionalAt.some((playCount) => players.willContainNumElements(playCount)),
    InstanceVariableComponent,
  });

  const baseWithHook = {
    ...baseTeamPlayVariant,
    useRequiredInstanceValue: () =>
      useRequiredInstanceValue(baseTeamPlayVariant),
  };

  if (enabledAt == null) {
    return baseWithHook;
  }

  /**
   * To support the 'enabledAt' player counts we can't simply use the basic
   * variant builder. What we can do is use the basic builder as a "base"
   * implementation, and then use those implemented methods in our raw impl.
   * This makes most of the additional logic straightforward and easy to
   * understand.
   */
  const teamPlayVariant: typeof baseWithHook = {
    ...baseWithHook,

    skip: (context) =>
      baseWithHook.skip(context) &&
      !enabledAt.includes(context.playerIds.length),

    hasValue: (context) =>
      baseWithHook.hasValue(context) ||
      enabledAt.includes(context.playerIds.length),

    extractInstanceValue: (upstreamInstance, context) =>
      baseWithHook.extractInstanceValue(upstreamInstance, context) ??
      (enabledAt.includes(context.playerIds.length) ? true : null),

    query: (template, context) => {
      const baseQuery = baseWithHook.query(template, context);
      return {
        ...baseQuery,
        canResolveTo: (value) =>
          enabledAt.includes(context.playerIds.length)
            ? value
            : baseQuery.canResolveTo(value),
      };
    },

    useRequiredInstanceValue() {
      // We deconstruct the hook from the base object so that lint detects we
      // are using a hook and warn us if we use it incorrectly (it doesn't
      // detect `something.useHook` as a hook call)
      const { useRequiredInstanceValue } = baseWithHook;
      const instanceValue = useRequiredInstanceValue();

      const playerCount = useAppSelector(playersSelectors.selectTotal);

      return instanceValue || enabledAt.includes(playerCount);
    },

    InstanceManualComponent: InstanceVariableComponent,
  };

  return Object.freeze(teamPlayVariant);
}
