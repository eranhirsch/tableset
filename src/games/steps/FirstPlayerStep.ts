import { WritableDraft } from "immer/dist/internal";
import invariant_violation from "../../common/err/invariant_violation";
import { Strategy } from "../../core/Strategy";
import { PlayerId } from "../../features/players/playersSlice";
import templateSlice, {
  templateAdapter,
} from "../../features/template/templateSlice";
import IGameStep, { TemplateContext } from "../IGameStep";

export default class FirstPlayerStep implements IGameStep<"firstPlayer"> {
  public readonly id = "firstPlayer";
  public readonly label: string = "First Player";

  public strategies({ playersTotal }: TemplateContext): Strategy[] {
    if (playersTotal < 2) {
      // Solo games don't have a starting player...
      return [Strategy.OFF];
    }
    return [Strategy.OFF, Strategy.RANDOM, Strategy.ASK, Strategy.FIXED];
  }

  public onPlayerRemoved(
    state: WritableDraft<ReturnType<typeof templateSlice["reducer"]>>,
    removedPlayerId: PlayerId,
    playersTotal: number
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

    if (
      step.strategy === Strategy.FIXED &&
      step.global &&
      step.value === removedPlayerId
    ) {
      // The first player was removed, we can't deduce another first player so
      // revert the step back to the default (most likely "OFF") state.
      templateAdapter.removeOne(state, "firstPlayer");
    }
  }
}
