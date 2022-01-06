import { ProductId } from "features/instance/Game";
import createConstantValueMetaStep from "games/core/steps/createConstantValueMetaStep";
import { ProductsMetaStep } from "games/core/steps/createProductDependencyMetaStep";
import { createVariant, VariantGameStep } from "games/core/steps/createVariant";
import { playersMetaStep } from "games/global";

const DEFAULT_DESCRIPTION = "Play in Teams!";

interface Options<Pid extends ProductId> {
  productDependencies?: {
    step: Readonly<ProductsMetaStep<Pid>>;
    products: readonly Pid[];
  };
  optionalAt?: readonly number[];
  enabledAt?: readonly number[];
  Description?: (() => JSX.Element) | string;
}

export default function createTeamVariant<Pid extends ProductId>({
  productDependencies,
  optionalAt = [],
  enabledAt,
  Description = DEFAULT_DESCRIPTION,
}: Options<Pid>): Readonly<VariantGameStep> {
  const baseTeamPlayVariant = createVariant({
    id: "teams",
    name: "Teams",

    dependencies: [
      playersMetaStep,
      productDependencies?.step ?? createConstantValueMetaStep(null),
    ],

    isTemplatable: (players, products) =>
      optionalAt.includes(players.onlyResolvableValue()!.length) &&
      (productDependencies == null ||
        products.willContainAny(productDependencies.products)),

    Description,
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

    computeInstanceValue: (instance, context) =>
      enabledAt.includes(context.playerIds.length) ||
      baseTeamPlayVariant.computeInstanceValue(instance, context),

    InstanceManualComponent: Description,
  };

  return Object.freeze(teamPlayVariant);
}
