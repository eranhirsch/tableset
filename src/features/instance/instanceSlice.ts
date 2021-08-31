import { createEntityAdapter, createSlice, Dictionary } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import invariant_violation from "../../common/err/invariant_violation";
import nullthrows from "../../common/err/nullthrows";
import { Strategy } from "../../core/Strategy";
import Game, { StepId } from "../../games/IGame";
import { InstanceContext } from "../../games/IGameStep";
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
      prepare: (
        game: Game,
        template: Dictionary<TemplateElement>,
        playerIds: readonly PlayerId[]
      ) => ({
        payload: game.order.reduce((ongoing, stepId) => {
          const element = template[stepId];
          if (element == null) {
            return ongoing;
          }

          const setupStep = {
            id: stepId,
            value: elementResolver(element, game, {
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

export const selectors = instanceAdapter.getSelectors<RootState>(
  (state) => state.instance
);

export default instanceSlice;

function elementResolver(
  element: TemplateElement,
  game: Game,
  context: InstanceContext
): any {
  const gameStep = nullthrows(
    game.at(element.id),
    `Element ${JSON.stringify(
      element
    )} does not have a corresponding step in the game`
  );

  switch (element.strategy) {
    case Strategy.RANDOM:
      if (gameStep.resolveRandom == null) {
        invariant_violation(
          `Element ${JSON.stringify(element)} does not have a random resolver`
        );
      }
      return gameStep.resolveRandom(context);

    case Strategy.DEFAULT:
      if (gameStep.resolveDefault == null) {
        invariant_violation(
          `Element ${JSON.stringify(element)} does not have a default resolver`
        );
      }
      return gameStep.resolveDefault(context);

    case Strategy.FIXED:
      // Just copy the value
      return element.value as any;
  }

  invariant_violation(
    `Element ${JSON.stringify(
      element
    )} is using a strategy that isn't supported`
  );
}
