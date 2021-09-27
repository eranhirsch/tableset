import { useAppSelector } from "app/hooks";
import { invariant_violation, ReactUtils } from "common";
import { Strategy } from "features/template/Strategy";
import { strategyLabel } from "features/template/strategyLabel";
import { StepId } from "games/core/IGame";
import { gameSelector } from "../game/gameSlice";
import { templateSelectors } from "./templateSlice";

export function ItemLabel({ stepId }: { stepId: StepId }): JSX.Element | null {
  const templateElement = ReactUtils.useAppEntityIdSelectorNullable(
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

  const { TemplateFixedValueLabel } = game.atEnforce(stepId);

  if (TemplateFixedValueLabel == null) {
    invariant_violation(`No label component defined for step ${stepId}`);
  }

  if (typeof TemplateFixedValueLabel === "string") {
    return <>{TemplateFixedValueLabel}</>;
  }

  return <TemplateFixedValueLabel value={templateElement.value} />;
}
