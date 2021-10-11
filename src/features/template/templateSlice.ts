import {
  createEntityAdapter,
  createSelector,
  createSlice,
  PayloadAction
} from "@reduxjs/toolkit";
import { RootState } from "app/store";
import { Dict, nullthrows, tuple, type_invariant, Vec } from "common";
import { expansionsActions } from "features/expansions/expansionsSlice";
import { playersActions } from "features/players/playersSlice";
import { Strategy } from "features/template/Strategy";
import { GameId, GAMES } from "games/core/GAMES";
import { PLAYERS_DEPENDENCY_META_STEP_ID } from "games/core/steps/createPlayersDependencyMetaStep";
import { PRODUCTS_DEPENDENCY_META_STEP_ID } from "games/core/steps/createProductDependencyMetaStep";
import { RandomGameStep } from "games/core/steps/createRandomGameStep";
import { ContextBase } from "model/ContextBase";
import { StepId } from "model/Game";
import { isTemplatable, Templatable } from "./Templatable";

export type TemplateElement = { id: StepId; isStale?: true } & (
  | { strategy: Strategy.FIXED; value: unknown }
  | { strategy: Strategy.RANDOM }
);

const templateAdapter = createEntityAdapter<TemplateElement>({
  selectId: (step) => step.id,
});

interface GlobalTemplateState {
  gameId: GameId;
}

const INITIAL_GLOBAL_STATE: GlobalTemplateState = { gameId: "concordia" };

const templateSlice = createSlice({
  name: "template",
  initialState: templateAdapter.getInitialState(INITIAL_GLOBAL_STATE),
  reducers: {
    enabled: (state, { payload: stepId }: PayloadAction<StepId>) => {
      templateAdapter.upsertOne(state, {
        id: stepId,
        strategy: Strategy.RANDOM,
      });
      markDownstreamElementsStale(stepId, state);
    },

    disabled: (state, action: PayloadAction<StepId>): void => {
      disabledImpl(state, action.payload);
    },

    enabledConstantValue: {
      prepare: (stepId: StepId, context: ContextBase) => ({
        payload: stepId,
        meta: context,
      }),

      reducer(
        state,
        {
          payload: stepId,
          meta: context,
        }: PayloadAction<StepId, string, ContextBase>
      ) {
        templateAdapter.upsertOne(state, {
          id: stepId,
          strategy: Strategy.FIXED,
          value: (GAMES[state.gameId].steps[stepId] as RandomGameStep<unknown>)
            .initialFixedValue!({ ...context, instance: [] }),
        });

        markDownstreamElementsStale(stepId, state);
      },
    },

    constantValueChanged(
      state,
      { payload: { id, value } }: PayloadAction<{ id: StepId; value: unknown }>
    ) {
      constantValueChangedImpl(state, id, value);
    },

    refresh: {
      prepare: (context: ContextBase) => ({
        payload: undefined,
        meta: context,
      }),
      reducer(
        state,
        { meta: context }: PayloadAction<unknown, string, ContextBase>
      ) {
        // Note that we don't perform these checks as part of a prior filter
        // step; this is because as we disable elements other elements
        // downstream might become stale and become untemplatable. If we
        // filtered first we would miss those cases.
        templateSteps(state).forEach(([{ id, canBeTemplated }, { isStale }]) =>
          removeUntemplatableStep(state, id, isStale, canBeTemplated, context)
        );

        // These steps are stale after removing all untemplatable ones, that
        // means we need to check their value to make sure it isn't invalid with
        // the new template and/or context.
        templateSteps(state).forEach(([{ refreshFixedValue }, element]) =>
          refreshStep(state, element, refreshFixedValue, context)
        );
      },
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(playersActions.added, (state) =>
        markDownstreamElementsStale(PLAYERS_DEPENDENCY_META_STEP_ID, state)
      )
      .addCase(playersActions.removed, (state) =>
        markDownstreamElementsStale(PLAYERS_DEPENDENCY_META_STEP_ID, state)
      )
      .addCase(expansionsActions.toggled, (state) =>
        markDownstreamElementsStale(PRODUCTS_DEPENDENCY_META_STEP_ID, state)
      );
  },
});
export default templateSlice;

export const templateSelectors = templateAdapter.getSelectors<RootState>(
  (state) => state.template
);
export const templateIsStaleSelector = createSelector(
  templateSelectors.selectAll,
  (elements) => elements.some(({ isStale }) => isStale)
);
export const fullTemplateSelector = createSelector(
  templateSelectors.selectAll,
  (elements) =>
    Dict.pull(
      elements,
      (element) =>
        element.strategy === Strategy.FIXED
          ? element.value
          : `__strategy:${element.strategy}`,
      ({ id }) => id
    )
);

export const templateActions = templateSlice.actions;

function disabledImpl(state: RootState["template"], stepId: StepId): void {
  templateAdapter.removeOne(state, stepId);
  markDownstreamElementsStale(stepId, state);
}

function constantValueChangedImpl(
  state: RootState["template"],
  stepId: StepId,
  value: unknown
): void {
  const element = nullthrows(
    state.entities[stepId],
    `Couldn't find step: ${stepId}, This action is only supported on elements which are already in the template`
  );

  if (element.strategy !== Strategy.FIXED) {
    throw new Error(
      `Trying to set fixed value when strategy isn't fixed for step: ${stepId}`
    );
  }

  element.value = value;

  markDownstreamElementsStale(stepId, state);
}

/**
 * Returns a tuple with both the template element and the Templatable
 * definition, while maintaining the original game order (order is important
 * because step dependencies are acyclic, so traversing the steps in order would
 * mean we always see a parent dependency before the downstream step that
 * depends on it)
 */
const templateSteps = ({
  gameId,
  entities,
}: RootState["template"]): readonly [Templatable, TemplateElement][] =>
  Vec.map_with_key(
    // The inner join is the cleanest way to filter both dicts on each-other's
    // keys.
    Dict.inner_join(
      GAMES[gameId].steps,
      // We need the cast because `Dictionary` (the RTK-defined type) is funky
      Dict.filter_nulls(entities) as Record<StepId, TemplateElement>
    ),
    (_, [step, elem]) =>
      tuple(
        // We `type_invariant` here instead of using a TS compile-time cast just
        // to be extra safe. All steps in the template should be `Templatable`, so
        // nothing here should throw
        type_invariant(
          step,
          isTemplatable,
          `Step ${step.id} is present in the template but is not Templatable!`
        ),
        elem
      )
  );

function markDownstreamElementsStale(
  changedElementId: StepId,
  state: RootState["template"]
): void {
  filterDownstreamSteps(changedElementId, state).forEach(
    (element) => (element.isStale = true)
  );
}

const filterDownstreamSteps = (
  changedElementId: StepId,
  state: RootState["template"]
): readonly TemplateElement[] =>
  Vec.map(
    Vec.filter(templateSteps(state), ([{ dependencies }]) =>
      // We look for the changed element in the dependencies for the step.
      dependencies.some(({ id }) => id === changedElementId)
    ),
    ([_, element]) => element
  );

function removeUntemplatableStep(
  state: RootState["template"],
  id: StepId,
  isStale: true | undefined,
  canBeTemplated: Templatable["canBeTemplated"],
  context: ContextBase
): void {
  if (isStale == null) {
    // Nothing to do
    return;
  }
  if (canBeTemplated(state.entities, context)) {
    return;
  }

  disabledImpl(state, id);
}

class UnfixableTemplateValue extends Error {}
class UnchangedTemplateValue extends Error {}

export function templateValue(special: "unfixable" | "unchanged"): never {
  switch (special) {
    case "unchanged":
      throw new UnchangedTemplateValue();
    case "unfixable":
      throw new UnfixableTemplateValue();
  }
}

function refreshStep(
  state: RootState["template"],
  element: TemplateElement,
  refreshFixedValue: Templatable["refreshFixedValue"],
  context: ContextBase
): void {
  if (element.isStale == null) {
    // Nothing to do
    return;
  }

  // Reset the isStale flag
  element.isStale = undefined;

  if (element.strategy !== Strategy.FIXED) {
    // Element is Random, it doesn't have anything to update
    return;
  }

  // The element has a fixed strategy, we need to go over the value
  // and update it to match the new context and other template
  // elements.
  try {
    const newValue = refreshFixedValue(element.value, state.entities, context);
    constantValueChangedImpl(state, element.id, newValue);
  } catch (e: unknown) {
    if (e instanceof UnfixableTemplateValue) {
      // The template value is unfixable, we need to reset it in order to make
      // the template valid again.
      disabledImpl(state, element.id);
      return;
    }

    if (e instanceof UnchangedTemplateValue) {
      // The value is unchanged, nothing left to do
      return;
    }

    // This should never happen so we just rethrow the error to let it bubble
    // up
    throw e;
  }
}
