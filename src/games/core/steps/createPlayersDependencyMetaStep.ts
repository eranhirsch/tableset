import { VariableGameStep } from "model/VariableGameStep";
import { PlayerId } from "../../../model/Player";
import { buildQuery } from "./Query";

export const playersMetaStep: Readonly<VariableGameStep<readonly PlayerId[]>> = {
  id: "__players",
  label: "<Players>",

  // trivial impl, these steps are never part of the template.
  coerceInstanceEntry: () => null,

  hasValue: ({ playerIds }) => playerIds.length > 0,

  extractInstanceValue: (_, { playerIds }) => playerIds,

  query: (_, { playerIds }) =>
    buildQuery("__players", {
      count: ({ min, max }) =>
        (min == null || playerIds.length >= min) &&
        (max == null || playerIds.length <= max),
      resolve: () => playerIds,
    }),
};
