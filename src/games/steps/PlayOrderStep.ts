import { WritableDraft } from "immer/dist/internal";
import invariant_violation from "../../common/err/invariant_violation";
import { Strategy } from "../../core/Strategy";
import { Player, PlayerId } from "../../features/players/playersSlice";
import {
  ConstantTemplateElement,
  templateAdapter,
  TemplateState,
} from "../../features/template/templateSlice";
import IGameStep, { TemplateContext } from "../IGameStep";

export default class PlayOrderStep implements IGameStep<"playOrder"> {
  public readonly id = "playOrder";
  public readonly label: string = "Seating";

  public strategies({ playersTotal }: TemplateContext): Strategy[] {
    if (playersTotal < 3) {
      // It's trivially uninteresting to talk about order when there aren't
      // enough players
      return [Strategy.OFF];
    }

    return [Strategy.OFF, Strategy.RANDOM, Strategy.ASK, Strategy.FIXED];
  }

  public initialFixedValue?(playerIds: string[]): ConstantTemplateElement {
    // Remove the first player which would be used as a pivot
    const [, ...restOfPlayers] = playerIds;
    return {
      id: "playOrder",
      strategy: Strategy.FIXED,
      global: true,
      value: restOfPlayers,
    };
  }

  public onPlayerAdded(
    state: WritableDraft<TemplateState>,
    { addedPlayer }: { addedPlayer: Player }
  ): void {
    const step = state.entities[this.id];
    if (step == null) {
      // Step not in template
      return;
    }

    if (step.id !== this.id) {
      invariant_violation(
        `Step ID ${step.id} is different it's index ${this.id}`
      );
    }

    if (step.strategy !== Strategy.FIXED) {
      return;
    }

    if (!step.global) {
      invariant_violation(`Global step ${this.id} not marked as global`);
    }

    step.value.push(addedPlayer.id);
  }

  public onPlayerRemoved(
    state: WritableDraft<TemplateState>,
    {
      removedPlayerId,
      playersTotal,
    }: { removedPlayerId: PlayerId; playersTotal: number }
  ): void {
    const step = state.entities[this.id];
    if (step == null) {
      // Step not in template
      return;
    }

    if (step.id !== this.id) {
      invariant_violation(
        `Step ID ${step.id} is different it's index ${this.id}`
      );
    }

    if (playersTotal === 3) {
      // When we only have 2 players there is no sense to play order so we
      // remove it from the template
      templateAdapter.removeOne(state, this.id);
      return;
    }

    if (step.strategy !== Strategy.FIXED) {
      return;
    }

    if (!step.global) {
      invariant_violation(`Global step ${this.id} not marked as global`);
    }

    const playerIndex = step.value.indexOf(removedPlayerId);
    if (playerIndex !== -1) {
      // Remove the player from the order
      step.value.splice(playerIndex, 1);
    } else {
      // TODO: We should find the next pivot and remove it from the list
      // instead of removing the whole config, but because that would require
      // sending more data into the action, we skip it for now...
      templateAdapter.removeOne(state, this.id);
    }
  }
}
