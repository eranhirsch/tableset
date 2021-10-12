import {
  createEntityAdapter,
  createSelector,
  createSlice
} from "@reduxjs/toolkit";
import { Dict } from "common";
import { templateSteps } from "features/template/templateSteps";
import { ContextBase } from "model/ContextBase";
import { RootState } from "../../app/store";
import { StepId } from "../../model/Game";

export type SetupStep = Readonly<{
  id: StepId;
  value: unknown;
}>;

const instanceAdapter = createEntityAdapter<SetupStep>({
  selectId: (step) => step.id,
});

export const instanceSlice = createSlice({
  name: "instance",
  initialState: instanceAdapter.getInitialState(),
  reducers: {
    created: {
      prepare: (
        templatables: ReturnType<typeof templateSteps>,
        context: ContextBase
      ) => ({
        payload: templatables.reduce((ongoing, [templatable, { config }]) => {
          const value = templatable.resolve(config, ongoing, context);

          if (value != null) {
            // Null means ignore the step, it is a valid response in some cases
            // (like variants, modules, and expansions)
            ongoing[templatable.id] = { id: templatable.id, value };
          }

          return ongoing;
        }, {} as Record<StepId, SetupStep>),
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
