import { createEntityAdapter, createSlice, Dictionary } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import invariant_violation from "../../common/err/invariant_violation";
import filter_nulls from "../../common/lib_utils/filter_nulls";
import { Strategy } from "../../core/Strategy";
import Game, { StepId } from "../../games/IGame";
import { PlayerId } from "../players/playersSlice";
import { TemplateElement } from "../template/templateSlice";

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
      prepare(
        game: Game,
        template: Dictionary<TemplateElement>,
        playerIds: readonly PlayerId[]
      ) {
        const payload: SetupStep[] = [];
        for (const element of filter_nulls(Object.values(template))) {
          let step: SetupStep;

          switch (element.strategy) {
            case Strategy.RANDOM:
              step = {
                id: element.id,
                value: game.at(element.id)!.resolveRandom!({
                  instance: payload,
                  playerIds,
                }),
              };
              break;

            case Strategy.DEFAULT:
              switch (element.id) {
                case "playOrder":
                case "playerColors":
                case "firstPlayer":
                  invariant_violation(`No default setting for ${element.id}`);
                  break;

                default:
                  step = {
                    id: element.id,
                    value: game.at(element.id)!.resolveDefault!({
                      instance: payload,
                      playerIds,
                    }),
                  };
              }
              break;

            case Strategy.FIXED:
              step = {
                id: element.id,
                value: element.value as any,
              };
              break;

            default:
              invariant_violation(
                `Unimplemented strategy type ${element.strategy} at step ${element.id}`
              );
          }

          payload.push(step);
        }

        return { payload };
      },

      reducer: instanceAdapter.setAll,
    },
  },
});

export const selectors = instanceAdapter.getSelectors<RootState>(
  (state) => state.instance
);

export default instanceSlice;
