import {
  createEntityAdapter,
  createSelector,
  createSlice,
  PayloadAction
} from "@reduxjs/toolkit";
import { RootState } from "app/store";
import { Dict, nullthrows, type_invariant, Vec } from "common";
import { collectionActions } from "features/collection/collectionSlice";
import { playersActions } from "features/players/playersSlice";
import { GameId, GAMES } from "games/core/GAMES";
import { playersMetaStep } from "games/global";
import { ContextBase } from "model/ContextBase";
import { Game, StepId } from "model/Game";
import { GameStepBase } from "model/GameStepBase";
import { VariableGameStep } from "model/VariableGameStep";
import { isTemplatable, Templatable } from "./Templatable";
import { templateSteps } from "./templateSteps";

export type TemplateElement<C = unknown> = {
  id: StepId;
  config: Readonly<C>;
  isStale?: true;
};

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
        const templatable = type_invariant(
          GAMES[state.gameId!].steps[id],
          isTemplatable
        );
        const config = templatable.initialConfig(state.entities, context);
        templateAdapter.addOne(state, { id, config });
        markDownstreamElementsStale(templatable, state);
      },
    },

    disabled: {
      prepare: ({ id }: Templatable) => ({ payload: id }),
      reducer(state, action: PayloadAction<StepId>): void {
        disabledImpl(state, action.payload);
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
        configUpdatedImpl(state, id, config);
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
        templateSteps(state).forEach(([{ id, canBeTemplated }, { isStale }]) =>
          removeUntemplatableStep(state, id, isStale, canBeTemplated, context)
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
      .addCase(playersActions.added, (state) =>
        markDownstreamElementsStale(playersMetaStep, state)
      )
      .addCase(playersActions.removed, (state) =>
        markDownstreamElementsStale(playersMetaStep, state)
      )
      .addCase(collectionActions.toggled, (state) =>
        markDownstreamElementsStale(
          GAMES[state.gameId!].productsMetaStep,
          state
        )
      );
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

export const hasGameTemplate = ({ id }: Game) =>
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

function disabledImpl(state: RootState["template"], stepId: StepId): void {
  templateAdapter.removeOne(state, stepId);
  markDownstreamElementsStale(GAMES[state.gameId!].steps[stepId], state);
}

function configUpdatedImpl<C = unknown>(
  state: RootState["template"],
  id: StepId,
  config: Readonly<C>
): void {
  templateAdapter.updateOne(state, {
    id,
    changes: { config },
  });
  markDownstreamElementsStale(GAMES[state.gameId!].steps[id], state);
}

const isVariableGameStep = (step: GameStepBase): step is VariableGameStep =>
  (step as Partial<VariableGameStep>).hasValue != null;

function markDownstreamElementsStale(
  step: GameStepBase,
  state: RootState["template"]
): void {
  filterDownstreamSteps(
    type_invariant(step, isVariableGameStep),
    state
  ).forEach((element) => (element.isStale = true));
}

const filterDownstreamSteps = (
  step: VariableGameStep,
  state: RootState["template"]
): readonly TemplateElement[] =>
  Vec.map(
    Vec.filter(templateSteps(state), ([{ dependencies }]) =>
      // We look for the changed element in the dependencies for the step.
      dependencies.includes(step)
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
    configUpdatedImpl(state, element.id, newValue);
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
