import {
  createEntityAdapter,
  createSelector,
  createSlice,
  PayloadAction
} from "@reduxjs/toolkit";
import { RootState } from "app/store";
import { $, coerce, Dict, nullthrows, Vec } from "common";
import { collectionActions } from "features/collection/collectionSlice";
import { Game, StepId } from "features/instance/Game";
import { playersActions } from "features/players/playersSlice";
import { ContextBase } from "features/useFeaturesContext";
import { GameId, GAMES } from "games/core/GAMES";
import { Queryable } from "games/core/steps/Queryable";
import { playersMetaStep } from "games/global";
import { Dependency, isTemplatable, Templatable } from "./Templatable";
import { templateSteps } from "./templateSteps";

export type TemplateElement<C = unknown> = {
  id: StepId;
  config: Readonly<C>;
  isStale?: true;
};

/**
 * In rare cases we might need to allow access to underlying implementation
 * details in order to let the algorithm for refresh to work as intended. This
 * prop, if existing in a step object, would allow us to ignore the wrapper.
 * IMPORTANT: Only use this rarely and wisely, this isn't good engineering!
 */
export interface __WithBackdoorWrappedStep_DO_NOT_USE {
  __backdoor_wrappedStep: Queryable<unknown>;
}

const templateAdapter = createEntityAdapter<TemplateElement>({
  selectId: (step) => step.id,
});

interface GlobalTemplateState {
  gameId?: GameId;
}

const INITIAL_GLOBAL_STATE: GlobalTemplateState = {};

export const templateSlice = createSlice({
  name: "template",
  initialState: templateAdapter.getInitialState(INITIAL_GLOBAL_STATE),
  reducers: {
    initialize: {
      prepare: ({ id }: Game) => ({ payload: id }),
      reducer(state, { payload: id }: PayloadAction<GameId>) {
        state.gameId = id;
        templateAdapter.removeAll(state);
      },
    },

    enabled: {
      prepare: ({ id }: Templatable, context: ContextBase) => ({
        payload: id,
        meta: { context },
      }),
      reducer(
        state,
        {
          payload: id,
          meta: { context },
        }: PayloadAction<StepId, string, { context: ContextBase }>
      ) {
        const templatable = coerce(
          GAMES[state.gameId!].steps[id],
          isTemplatable
        );

        let { initialConfig } = templatable;
        if (typeof initialConfig === "function") {
          initialConfig = initialConfig(state.entities, context);
        }
        templateAdapter.addOne(state, { id, config: initialConfig });
        markDownstreamElementsStale(templatable, state);
      },
    },

    disabled: {
      prepare: ({ id }: Templatable) => ({ payload: id }),
      reducer(state, { payload: id }: PayloadAction<StepId>): void {
        disabledImpl(state, GAMES[state.gameId!].steps[id] as Templatable);
      },
    },

    configUpdated: {
      prepare: ({ id }: Templatable, config: Readonly<unknown>) => ({
        payload: { id, config },
      }),
      reducer(
        state,
        {
          payload: { id, config },
        }: PayloadAction<{ id: StepId; config: Readonly<unknown> }>
      ) {
        configUpdatedImpl(
          state,
          GAMES[state.gameId!].steps[id] as Templatable,
          config
        );
      },
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
        templateSteps(state).forEach(([step, { isStale }]) =>
          removeUntemplatableStep(state, step, isStale, context)
        );

        // These steps are stale after removing all untemplatable ones, that
        // means we need to check their value to make sure it isn't invalid with
        // the new template and/or context.
        templateSteps(state).forEach(([{ refreshTemplateConfig }, element]) =>
          refreshStep(state, element, refreshTemplateConfig, context)
        );
      },
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(playersActions.addedToTable, (state) =>
        markDownstreamElementsStale(playersMetaStep, state)
      )
      .addCase(playersActions.removedFromTable, (state) =>
        markDownstreamElementsStale(playersMetaStep, state)
      )
      .addCase(collectionActions.toggled, (state) => {
        if (state.gameId == null) {
          return;
        }
        markDownstreamElementsStale(
          GAMES[state.gameId].productsMetaStep,
          state
        );
      });
  },
});

export const wholeTemplateSelector = ({ template }: RootState) => template;
export const templateSelectors = templateAdapter.getSelectors<RootState>(
  wholeTemplateSelector
);

export const templateElementSelectorNullable =
  <T = unknown, C = unknown>({ id }: Templatable<T, C>) =>
  (state: RootState) =>
    templateSelectors.selectById(state, id) as TemplateElement<C> | undefined;
export const templateElementSelectorEnforce =
  <T = unknown, C = unknown>(templatable: Templatable<T, C>) =>
  (state: RootState) =>
    nullthrows(
      templateElementSelectorNullable(templatable)(state),
      `Template missing element for step ${templatable.id}`
    );

export const hasGameTemplateSelector = ({ id }: Game) =>
  createSelector(
    wholeTemplateSelector,
    templateSelectors.selectTotal,
    ({ gameId }, count) => gameId === id && count > 0
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
      ({ config }) => config,
      ({ id }) => id
    )
);

export const templateActions = templateSlice.actions;

function disabledImpl(state: RootState["template"], step: Templatable): void {
  templateAdapter.removeOne(state, step.id);
  markDownstreamElementsStale(step, state);
}

function configUpdatedImpl<C = unknown>(
  state: RootState["template"],
  step: Templatable,
  config: Readonly<C>
): void {
  templateAdapter.updateOne(state, {
    id: step.id,
    changes: { config },
  });
  markDownstreamElementsStale(step, state);
}

function markDownstreamElementsStale(
  step: Dependency<unknown>,
  state: RootState["template"]
): void {
  filterDownstreamSteps(step, state).forEach(
    (element) => (element.isStale = true)
  );
}

const filterDownstreamSteps = (
  step: Dependency<unknown>,
  state: RootState["template"]
): readonly TemplateElement[] =>
  $(
    state,
    templateSteps,
    ($$) =>
      Vec.filter(
        $$,
        ([{ dependencies }]) =>
          dependencies.includes(step) ||
          Vec.maybe_map(
            dependencies,
            (dependency) =>
              (dependency as Partial<__WithBackdoorWrappedStep_DO_NOT_USE>)
                .__backdoor_wrappedStep
          ).includes(step)
      ),
    ($$) => Vec.map($$, ([_, element]) => element)
  );

function removeUntemplatableStep(
  state: RootState["template"],
  step: Templatable,
  isStale: true | undefined,
  context: ContextBase
): void {
  if (isStale == null) {
    // Nothing to do
    return;
  }
  if (step.canBeTemplated(state.entities, context)) {
    return;
  }

  disabledImpl(state, step);
}

export class UnfixableTemplateValue extends Error {}
export class UnchangedTemplateValue extends Error {}

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
  refreshTemplateConfig: Templatable["refreshTemplateConfig"],
  context: ContextBase
): void {
  if (element.isStale == null) {
    // Nothing to do
    return;
  }

  // Reset the isStale flag
  element.isStale = undefined;

  // The element has a fixed strategy, we need to go over the value
  // and update it to match the new context and other template
  // elements.
  try {
    const newValue = refreshTemplateConfig(
      element.config,
      state.entities,
      context
    );
    configUpdatedImpl(
      state,
      GAMES[state.gameId!].steps[element.id] as Templatable,
      newValue
    );
  } catch (e: unknown) {
    if (e instanceof UnfixableTemplateValue) {
      // The template value is unfixable, we need to reset it in order to make
      // the template valid again.
      disabledImpl(
        state,
        GAMES[state.gameId!].steps[element.id] as Templatable
      );
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
