import {
  createEntityAdapter,
  createSlice,
  Dictionary,
  EntityId,
} from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import filter_nulls from "../../common/lib_utils/filter_nulls";
import PlayerColors from "../../common/PlayerColors";
import { Strategy } from "../../core/Strategy";
import ConcordiaGame, {
  SetupStepName,
} from "../../games/concordia/ConcordiaGame";
import { TemplateElement } from "../template/templateSlice";

type SetupStep<T> =
  | {
      id: "playOrder";
      value: EntityId[];
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
    };

const instanceAdapter = createEntityAdapter<SetupStep<SetupStepName>>({
  selectId: (step) => step.id,
});

export const instanceSlice = createSlice({
  name: "instance",
  initialState: instanceAdapter.getInitialState(),
  reducers: {
    created: {
      prepare: (
        template: Dictionary<TemplateElement<SetupStepName>>,
        playersTotal: number
      ) => ({
        payload: filter_nulls(Object.values(template)).map((element) => ({
          id: element.id,
          value:
            element.strategy === Strategy.FIXED
              ? (element.value as any)
              : ConcordiaGame.resolve(
                  element.id,
                  element.strategy,
                  playersTotal
                ),
        })),
      }),
      reducer: instanceAdapter.setAll,
    },
  },
});

export const selectors = instanceAdapter.getSelectors<RootState>(
  (state) => state.instance
);

export default instanceSlice;
