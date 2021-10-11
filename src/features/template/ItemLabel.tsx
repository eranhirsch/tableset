import { useAppSelector } from "app/hooks";
import { invariant_violation, ReactUtils } from "common";
import { Strategy } from "features/template/Strategy";
import { strategyLabel } from "features/template/strategyLabel";
import { RandomGameStep } from "games/core/steps/createRandomGameStep";
import { StepId } from "model/Game";
import { gameStepSelector } from "../game/gameSlice";
import { templateSelectors } from "./templateSlice";

export function ItemLabel({ stepId }: { stepId: StepId }): JSX.Element | null {
  const templateElement = ReactUtils.useAppEntityIdSelectorNullable(
    templateSelectors,
    stepId
  );
  const { TemplateFixedValueLabel } = useAppSelector(
    gameStepSelector(stepId)
  ) as RandomGameStep;

  if (templateElement == null) {
    return <>Disabled</>;
  }

  if (templateElement.strategy !== Strategy.FIXED) {
    return <>{strategyLabel(templateElement.strategy)}</>;
  }

  if (TemplateFixedValueLabel == null) {
    invariant_violation(`No label component defined for step ${stepId}`);
  }

  if (typeof TemplateFixedValueLabel === "string") {
    return <>{TemplateFixedValueLabel}</>;
  }

  return <TemplateFixedValueLabel value={templateElement.value} />;
}
