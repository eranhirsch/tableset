import {
  createEntityAdapter,
  createSelector,
  createSlice,
  Dictionary,
  PayloadAction,
} from "@reduxjs/toolkit";
import { Dict } from "common";
import { TemplateElement } from "features/template/templateSlice";
import { templateSteps } from "features/template/templateSteps";
import { GameId } from "games/core/GAMES";
import { ContextBase } from "model/ContextBase";
import { RootState } from "../../app/store";
import { Game, StepId } from "../../model/Game";

export type SetupStep = Readonly<{
  id: StepId;
  value: unknown;
}>;

const instanceAdapter = createEntityAdapter<SetupStep>({
  selectId: (step) => step.id,
});

interface GlobalTemplateState {
  gameId?: GameId;
}

const INITIAL_GLOBAL_STATE: GlobalTemplateState = {};

export const instanceSlice = createSlice({
  name: "instance",
  initialState: instanceAdapter.getInitialState(INITIAL_GLOBAL_STATE),
  reducers: {
    reset: {
      prepare: ({ id }: Game) => ({ payload: id }),
      reducer(state, { payload: gameId }: PayloadAction<GameId>) {
        state.gameId = gameId;
        instanceAdapter.removeAll(state);
      },
    },

    created: {
      prepare: (
        wholeTemplate: {
          gameId?: GameId;
          entities: Dictionary<TemplateElement>;
        },
        context: ContextBase
      ) => ({
        payload: {
          gameId: wholeTemplate.gameId!,
          instance: templateSteps(wholeTemplate).reduce(
            (ongoing, [templatable, { config }]) => {
              const value = templatable.resolve(config, ongoing, context);

              if (value != null) {
                // Null means ignore the step, it is a valid response in some cases
                // (like variants, modules, and expansions)
                ongoing[templatable.id] = { id: templatable.id, value };
              }

              return ongoing;
            },
            {} as Record<StepId, SetupStep>
          ),
        },
      }),

      reducer(
        state,
        {
          payload: { gameId, instance },
        }: PayloadAction<{
          gameId: GameId;
          instance: Readonly<Record<StepId, SetupStep>>;
        }>
      ) {
        state.gameId = gameId;
        instanceAdapter.setAll(state, instance);
      },
    },
  },
});

export const instanceActions = instanceSlice.actions;

const wholeInstanceSelector = ({ instance }: RootState) => instance;
export const instanceSelectors = instanceAdapter.getSelectors<RootState>(
  wholeInstanceSelector
);
export const hasGameInstanceSelector = ({ id }: Game) =>
  createSelector(
    wholeInstanceSelector,
    instanceSelectors.selectTotal,
    ({ gameId }, count) => gameId === id && count > 0
  );

export const fullInstanceSelector = createSelector(
  instanceSelectors.selectAll,
  (steps) =>
    Dict.pull(
      steps,
      ({ value }) => value,
      ({ id }) => id
    )
);
