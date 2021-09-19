import { strategyLabel } from "../../core/content";
import { templateSelectors } from "./templateSlice";
import Strategy from "../../core/Strategy";
import { useAppEntityIdSelectorNullable } from "../../common/hooks/useAppEntityIdSelector";
import { useAppSelector } from "../../app/hooks";
import { gameSelector } from "../game/gameSlice";
import { StepId } from "../../games/core/IGame";
import { nullthrows } from "../../common/err";

export function ItemLabel({ stepId }: { stepId: StepId }): JSX.Element | null {
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

  const TemplateFixedValueLabel = nullthrows(
    game.atEnforce(stepId).TemplateFixedValueLabel,
    `No label component defined for step ${stepId}`
  );

  return <TemplateFixedValueLabel value={templateElement.value} />;
}
