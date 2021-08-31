import { strategyLabel } from "../../core/content";
import { selectors as templateSelectors } from "./templateSlice";
import { Strategy } from "../../core/Strategy";
import { useAppEntityIdSelectorNullable } from "../../common/hooks/useAppEntityIdSelector";
import { useAppSelector } from "../../app/hooks";
import { StepId } from "../../games/IGame";
import { gameSelector } from "../game/gameSlice";

export function ItemLabel({ stepId }: { stepId: StepId }): JSX.Element {
  const templateElement = useAppEntityIdSelectorNullable(
    templateSelectors,
    stepId
  );

  const game = useAppSelector(gameSelector);

  if (templateElement == null) {
    return <>{strategyLabel(Strategy.OFF)}</>;
  }

  if (templateElement.strategy !== Strategy.FIXED) {
    return <>{strategyLabel(templateElement.strategy)}</>;
  }

  return game.at(stepId)!.renderTemplateFixedLabel!(templateElement.value);
}
