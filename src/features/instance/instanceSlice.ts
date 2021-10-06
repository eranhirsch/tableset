import {
  createEntityAdapter,
  createSelector,
  createSlice,
  Dictionary,
} from "@reduxjs/toolkit";
import { Dict } from "common";
import { RandomGameStep } from "games/core/steps/createRandomGameStep";
import { RootState } from "../../app/store";
import { ProductId, StepId } from "../../model/Game";
import { PlayerId } from "../../model/Player";
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
        allRandomSteps: readonly RandomGameStep[],
        template: Dictionary<TemplateElement>,
        playerIds: readonly PlayerId[],
        productIds: readonly ProductId[]
      ) => ({
        payload: allRandomSteps.reduce((ongoing, step) => {
          const element = template[step.id];
          if (element == null) {
            return ongoing;
          }

          const value = templateElementResolver(step, element, {
            instance: ongoing,
            playerIds,
            productIds,
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
