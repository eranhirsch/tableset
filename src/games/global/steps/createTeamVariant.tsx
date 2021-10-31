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

export default function createTeamVariant<ProductId = never>({
  productDependencies,
  optionalAt,
  enabledAt,
  InstanceVariableComponent,
}: Options<ProductId>): Readonly<VariableGameStep<boolean>> {
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

  if (enabledAt == null) {
    return baseTeamPlayVariant;
  }

  /**
   * To support the 'enabledAt' player counts we can't simply use the basic
   * variant builder. What we can do is use the basic builder as a "base"
   * implementation, and then use those implemented methods in our raw impl.
   * This makes most of the additional logic straightforward and easy to
   * understand.
   */
  const teamPlayVariant: typeof baseTeamPlayVariant = {
    ...baseTeamPlayVariant,

    skip: (context) =>
      baseTeamPlayVariant.skip(context) &&
      !enabledAt.includes(context.playerIds.length),

    hasValue: (context) =>
      baseTeamPlayVariant.hasValue(context) ||
      enabledAt.includes(context.playerIds.length),

    extractInstanceValue: (upstreamInstance, context) =>
      baseTeamPlayVariant.extractInstanceValue(upstreamInstance, context) ??
      (enabledAt.includes(context.playerIds.length) ? true : null),
    coerceInstanceEntry: (instanceElement, context) =>
      baseTeamPlayVariant.coerceInstanceEntry(instanceElement, context) ??
      (enabledAt.includes(context.playerIds.length) ? true : null),

    query: (template, context) => {
      const baseQuery = baseTeamPlayVariant.query(template, context);
      return {
        ...baseQuery,
        canResolveTo: (value) =>
          enabledAt.includes(context.playerIds.length)
            ? value
            : baseQuery.canResolveTo(value),
      };
    },

    InstanceManualComponent: InstanceVariableComponent,
  };

  return Object.freeze(teamPlayVariant);
}
