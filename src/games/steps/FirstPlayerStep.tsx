import { WritableDraft } from "immer/dist/internal";
import invariant_violation from "../../common/err/invariant_violation";
import { Strategy } from "../../core/Strategy";
import { PlayerId } from "../../features/players/playersSlice";
import {
  ConstantTemplateElement,
  templateAdapter,
  TemplateState,
} from "../../features/template/templateSlice";
import IGameStep, { InstanceContext, TemplateContext } from "../IGameStep";
import FirstPlayerFixedTemplateLabel from "../ux/FirstPlayerFixedTemplateLabel";
import StartingPlayerPanel from "../ux/StartingPlayerPanel";

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

  public initialFixedValue(playerIds: string[]): ConstantTemplateElement {
    return {
      id: "firstPlayer",
      strategy: Strategy.FIXED,
      global: true,
      value: playerIds[0],
    };
  }

  public resolveRandom({ playerIds }: InstanceContext): PlayerId {
    return playerIds[Math.floor(Math.random() * playerIds.length)];
  }

  public renderTemplateFixedLabel(value: any): JSX.Element {
    return <FirstPlayerFixedTemplateLabel value={value as PlayerId} />;
  }

  public renderTemplateFixedValueSelector(): JSX.Element {
    return <StartingPlayerPanel />;
  }

  public onPlayerRemoved(
    state: WritableDraft<TemplateState>,
    { removedPlayerId }: { removedPlayerId: PlayerId }
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
