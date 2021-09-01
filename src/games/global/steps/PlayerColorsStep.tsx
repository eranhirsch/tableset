import { WritableDraft } from "immer/dist/internal";
import invariant from "../../../common/err/invariant";
import invariant_violation from "../../../common/err/invariant_violation";
import nullthrows from "../../../common/err/nullthrows";
import PermutationsLazyArray from "../../../common/PermutationsLazyArray";
import PlayerColors from "../../../common/PlayerColors";
import { Strategy } from "../../../core/Strategy";
import { GamePiecesColor } from "../../../core/themeWithGameColors";
import { Player, PlayerId } from "../../../features/players/playersSlice";
import {
  ConstantTemplateElement,
  TemplateElement,
  TemplateState,
  templateAdapter,
} from "../../../features/template/templateSlice";
import IGameStep, {
  TemplateContext,
  InstanceContext,
} from "../../core/steps/IGameStep";
import PlayerColorPanel from "../ux/PlayerColorPanel";
import PlayersColorsFixedTemplateLabel from "../ux/PlayerColorsFixedTemplateLabel";
import { PlayerColorsPanel } from "../ux/PlayerColorsPanel";

export default class PlayerColorsStep implements IGameStep<PlayerColors> {
  public readonly id: string = "playerColors";
  public readonly label: string = "Colors";

  public constructor(private availableColors: readonly GamePiecesColor[]) {}

  public strategies({ playerIds }: TemplateContext): readonly Strategy[] {
    if (playerIds.length < 1) {
      // No one to assign a color to
      return [Strategy.OFF];
    }

    if (playerIds.length > this.availableColors.length) {
      // Too many players to assign colors to
      return [Strategy.OFF];
    }

    return [Strategy.OFF, Strategy.RANDOM, Strategy.ASK, Strategy.FIXED];
  }

  public initialFixedValue(playerIds: string[]): ConstantTemplateElement {
    return {
      id: "playerColors",
      strategy: Strategy.FIXED,
      value: Object.fromEntries(
        playerIds.map((playerId, index) => [
          playerId,
          this.availableColors[index],
        ])
      ),
    };
  }

  public resolveRandom({ playerIds }: InstanceContext): PlayerColors {
    const permutations = PermutationsLazyArray.forPermutation(
      this.availableColors
    );
    const selectedIdx = Math.floor(Math.random() * permutations.length);
    const permutation = nullthrows(permutations.at(selectedIdx));
    return Object.fromEntries(
      playerIds.map((playerId, index) => [playerId, permutation[index]])
    );
  }

  public renderTemplateFixedLabel(value: any): JSX.Element {
    return <PlayersColorsFixedTemplateLabel value={value as PlayerColors} />;
  }

  public renderTemplateFixedValueSelector(): JSX.Element {
    return (
      <PlayerColorPanel
        availableColors={this.availableColors}
        gameStep={this}
      />
    );
  }

  public renderInstanceContent(value: any): JSX.Element {
    return <PlayerColorsPanel playerColor={value as PlayerColors} />;
  }

  public extractTemplateFixedValue(element: TemplateElement): PlayerColors {
    invariant(
      this.id === element.id,
      `Element ${JSON.stringify(element)} does not match this step id ${
        this.id
      }`
    );

    if (element.strategy !== Strategy.FIXED) {
      invariant_violation(
        `Element ${JSON.stringify(element)} does not have a fixed strategy`
      );
    }

    return element.value as PlayerColors;
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

    const usedColors = Object.values(step.value);
    const availableColor = this.availableColors.find(
      (color) => !usedColors.includes(color)
    );
    if (availableColor != null) {
      step.value[addedPlayer.id] = availableColor;
    } else {
      // Too many players for this step, just remove the whole thing from the
      // template
      templateAdapter.removeOne(state, this.id);
    }
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

    if (step.strategy === Strategy.FIXED) {
      // Remove the removed players color config
      delete step.value[removedPlayerId];
    }
  }
}