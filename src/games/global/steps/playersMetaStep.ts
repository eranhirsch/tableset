import { MetaGameStep } from "features/instance/MetaGameStep";
import { PlayerId } from "features/players/playersSlice";
import { buildQuery } from "../../core/steps/Query";

const playersMetaStep: Readonly<MetaGameStep<readonly PlayerId[]>> = {
  id: "__players",

  computeInstanceValue: (_, { playerIds }) => playerIds,

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
