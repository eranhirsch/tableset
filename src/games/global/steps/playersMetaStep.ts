import { PlayerId } from "features/players/playersSlice";
import { VariableGameStep } from "model/VariableGameStep";
import { buildQuery } from "../../core/steps/Query";

const playersMetaStep: Readonly<VariableGameStep<readonly PlayerId[]>> = {
  id: "__players",
  label: "<Players>",

  extractInstanceValue: (_, { playerIds }) => playerIds,

  query: (_, { playerIds }) =>
    buildQuery("__players", {
      willContainNumElements: (limit) =>
        typeof limit === "number"
          ? playerIds.length === limit
          : (limit.min == null || playerIds.length >= limit.min) &&
            (limit.max == null || playerIds.length <= limit.max),
      onlyResolvableValue: () => playerIds,
    }),
};
export default playersMetaStep;
