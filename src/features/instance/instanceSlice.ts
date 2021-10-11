import {
  createEntityAdapter,
  createSelector,
  createSlice,
  Dictionary,
} from "@reduxjs/toolkit";
import { Dict, Vec } from "common";
import { RandomGameStep } from "games/core/steps/createRandomGameStep";
import { ContextBase } from "model/ContextBase";
import { GameStepBase } from "model/GameStepBase";
import { RootState } from "../../app/store";
import { Game, StepId } from "../../model/Game";
import { TemplateElement } from "../template/templateSlice";
import { templateElementResolver } from "./templateElementResolver";

export type SetupStep = Readonly<{
  id: StepId;
  value: unknown;
}>;

const instanceAdapter = createEntityAdapter<SetupStep>({
  selectId: (step) => step.id,
});

export default createSlice({
  name: "instance",
  initialState: instanceAdapter.getInitialState(),
  reducers: {
    created: {
      prepare: (
        game: Game,
        template: Dictionary<TemplateElement>,
        context: ContextBase
      ) => ({
        payload: Vec.filter(
          Vec.values(game.steps),
          (x: GameStepBase): x is RandomGameStep =>
            (x as Partial<RandomGameStep>).resolveRandom != null
        ).reduce((ongoing, step) => {
          const element = template[step.id];
          if (element == null) {
            return ongoing;
          }

          const value = templateElementResolver(step, element, {
            ...context,
            instance: ongoing,
          });

          if (value != null) {
            // Null means ignore the step, it is a valid response in some cases
            // (like variants, modules, and expansions)
            ongoing.push({ id: step.id, value });
          }

          return ongoing;
        }, [] as SetupStep[]),
      }),

      reducer: instanceAdapter.setAll,
    },
  },
});

export const instanceSelectors = instanceAdapter.getSelectors<RootState>(
  (state) => state.instance
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
