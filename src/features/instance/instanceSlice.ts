import { createEntityAdapter, createSlice, Dictionary } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import nullthrows from "../../common/err/nullthrows";
import IGame, { StepId } from "../../games/core/IGame";
import { PlayerId } from "../players/playersSlice";
import { TemplateElement } from "../template/templateSlice";
import { templateElementResolver } from "./templateElementResolver";

export type SetupStep = Readonly<{
  id: StepId;
  value: any;
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
        game: IGame,
        template: Dictionary<TemplateElement>,
        playerIds: readonly PlayerId[]
      ) => ({
        payload: game.steps.reduce((ongoing, step) => {
          const element = template[step.id];
          if (element == null) {
            return ongoing;
          }

          const gameStep = nullthrows(
            game.at(element.id),
            `Element ${JSON.stringify(
              element
            )} does not have a corresponding step in the game`
          );

          const setupStep = {
            id: step.id,
            value: templateElementResolver(gameStep, element, {
              instance: ongoing,
              playerIds,
            }),
          };
          return ongoing.concat(setupStep);
        }, [] as readonly SetupStep[]),
      }),

      reducer: instanceAdapter.setAll,
    },
  },
});

export const instanceSelectors = instanceAdapter.getSelectors<RootState>(
  (state) => state.instance
);

export default instanceSlice;


