import { createEntityAdapter, createSlice, Dictionary } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import IGame, { ProductId, StepId } from "../../model/IGame";
import { PlayerId } from "../../model/Player";
import { TemplateElement } from "../template/templateSlice";
import { templateElementResolver } from "./templateElementResolver";

export type SetupStep = Readonly<{
  id: StepId;
  value: any;
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
        game: IGame,
        template: Dictionary<TemplateElement>,
        playerIds: readonly PlayerId[],
        productIds: readonly ProductId[]
      ) => ({
        payload: game.steps.reduce((ongoing, { id }) => {
          const element = template[id];
          if (element == null) {
            return ongoing;
          }

          const value = templateElementResolver(game.atEnforce(id), element, {
            instance: ongoing,
            playerIds,
            productIds,
          });

          if (value != null) {
            // Null means ignore the step, it is a valid response in some cases
            // (like variants, modules, and expansions)
            ongoing.push({ id, value });
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
