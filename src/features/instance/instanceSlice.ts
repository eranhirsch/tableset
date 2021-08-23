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
import ConcordiaGame, {
  SetupStepName,
} from "../../games/concordia/ConcordiaGame";
import { TemplateElement } from "../template/templateSlice";

export type SetupStep<T> = Readonly<
  | {
      id: "playOrder";
      value: ReadonlyArray<EntityId>;
    }
  | {
      id: "playerColors";
      value: PlayerColors;
    }
  | {
      id: "firstPlayer";
      value: EntityId;
    }
  | {
      id: Exclude<T, "playOrder" | "playerColors" | "firstPlayer">;
      value: string;
    }
>;

const instanceAdapter = createEntityAdapter<SetupStep<SetupStepName>>({
  selectId: (step) => step.id,
});

export const instanceSlice = createSlice({
  name: "instance",
  initialState: instanceAdapter.getInitialState(),
  reducers: {
    created: {
      prepare(
        template: Dictionary<TemplateElement<SetupStepName>>,
        playerIds: ReadonlyArray<EntityId>
      ) {
        const payload: SetupStep<SetupStepName>[] = [];
        for (const element of filter_nulls(Object.values(template))) {
          let step: SetupStep<SetupStepName>;

          switch (element.strategy) {
            case Strategy.RANDOM:
              switch (element.id) {
                case "playerColors":
                  {
                    const permutations = PermutationsLazyArray.forPermutation(
                      ConcordiaGame.playerColors
                    );
                    const selectedIdx = Math.floor(
                      Math.random() * permutations.length
                    );
                    const permutation = nullthrows(
                      permutations.at(selectedIdx)
                    );
                    step = {
                      id: "playerColors",
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
                    const [, ...remainingPlayers] = playerIds;
                    const permutations =
                      PermutationsLazyArray.forPermutation(remainingPlayers);
                    const selectedIdx = Math.floor(
                      Math.random() * permutations.length
                    );
                    const permutation = nullthrows(
                      permutations.at(selectedIdx)
                    );
                    step = { id: "playOrder", value: permutation };
                  }
                  break;

                case "firstPlayer":
                  step = {
                    id: "firstPlayer",
                    value:
                      playerIds[Math.floor(Math.random() * playerIds.length)],
                  };
                  break;

                default:
                  step = {
                    id: element.id,
                    value: ConcordiaGame.resolve(
                      element.id,
                      element.strategy,
                      payload,
                      playerIds.length
                    ),
                  };
              }
              break;

            case Strategy.FIXED:
              step = { id: element.id, value: element.value as any };
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
