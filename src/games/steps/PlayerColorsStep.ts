import { WritableDraft } from "immer/dist/internal";
import invariant_violation from "../../common/err/invariant_violation";
import nullthrows from "../../common/err/nullthrows";
import { Strategy } from "../../core/Strategy";
import { GamePiecesColor } from "../../core/themeWithGameColors";
import { Player, PlayerId } from "../../features/players/playersSlice";
import templateSlice from "../../features/template/templateSlice";
import IGameStep, { TemplateContext } from "../IGameStep";

export default class PlayerColorsStep implements IGameStep<"playerColors"> {
  public readonly id = "playerColors";
  public readonly label: string = "Colors";

  public constructor(private availableColors: readonly GamePiecesColor[]) {}

  public strategies({ playersTotal }: TemplateContext): readonly Strategy[] {
    if (playersTotal < 1) {
      // No one to assign a color to
      return [Strategy.OFF];
    }

    if (playersTotal > this.availableColors.length) {
      // Too many players to assign colors to
      return [Strategy.OFF];
    }

    return [Strategy.OFF, Strategy.RANDOM, Strategy.ASK, Strategy.FIXED];
  }

  onPlayerAdded(
    state: WritableDraft<ReturnType<typeof templateSlice["reducer"]>>,
    addedPlayer: Player
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

    const usedColors = Object.values(step.value);
    step.value[addedPlayer.id] = nullthrows(
      this.availableColors.find((color) => !usedColors.includes(color)),
      `No more colors available for new player`
    );
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

    if (step.strategy === Strategy.FIXED && step.global) {
      // Remove the removed players color config
      delete step.value[removedPlayerId];
    }
  }
}
