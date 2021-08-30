import {
  createEntityAdapter,
  createSlice,
  Dictionary,
  EntityId,
} from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import invariant_violation from "../../common/err/invariant_violation";
import nullthrows from "../../common/err/nullthrows";
import filter_nulls from "../../common/lib_utils/filter_nulls";
import PermutationsLazyArray from "../../common/PermutationsLazyArray";
import PlayerColors from "../../common/PlayerColors";
import { Strategy } from "../../core/Strategy";
import Game, { StepId } from "../../games/IGame";
import { TemplateElement } from "../template/templateSlice";

export type SetupStep = Readonly<
  | {
      id: "playOrder";
      global: true;
      value: ReadonlyArray<EntityId>;
    }
  | {
      id: "playerColors";
      global: true;
      value: PlayerColors;
    }
  | {
      id: "firstPlayer";
      global: true;
      value: EntityId;
    }
  | {
      id: StepId;
      global: false;
      value: string;
    }
>;

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
        playerIds: ReadonlyArray<EntityId>
      ) {
        const payload: SetupStep[] = [];
        for (const element of filter_nulls(Object.values(template))) {
          let step: SetupStep;

          switch (element.strategy) {
            case Strategy.RANDOM:
              switch (element.id) {
                case "playerColors":
                  {
                    const permutations = PermutationsLazyArray.forPermutation(
                      game.playerColors
                    );
                    const selectedIdx = Math.floor(
                      Math.random() * permutations.length
                    );
                    const permutation = nullthrows(
                      permutations.at(selectedIdx)
                    );
                    step = {
                      id: "playerColors",
                      global: true,
                      value: Object.fromEntries(
                        playerIds.map((playerId, index) => [
                          playerId,
                          permutation[index],
                        ])
                      ),
                    };
                  }
                  break;

                case "playOrder":
                  {
                    // Remove the first player as the pivot
                    const [, ...restOfPlayers] = playerIds;
                    const permutations =
                      PermutationsLazyArray.forPermutation(restOfPlayers);
                    const selectedIdx = Math.floor(
                      Math.random() * permutations.length
                    );
                    const permutation = nullthrows(
                      permutations.at(selectedIdx)
                    );
                    step = {
                      id: "playOrder",
                      global: true,
                      value: permutation,
                    };
                  }
                  break;

                case "firstPlayer":
                  step = {
                    id: "firstPlayer",
                    global: true,
                    value:
                      playerIds[Math.floor(Math.random() * playerIds.length)],
                  };
                  break;

                default:
                  step = {
                    id: element.id,
                    global: false,
                    value: game.at(element.id)!.resolveRandom!(
                      payload,
                      playerIds.length
                    ),
                  };
              }
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
                    global: false,
                    value: game.resolveDefault(
                      element.id,
                      payload,
                      playerIds.length
                    ),
                  };
              }
              break;

            case Strategy.FIXED:
              step = {
                id: element.id,
                global: false,
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
