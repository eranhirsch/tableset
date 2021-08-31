import { Chip } from "@material-ui/core";
import { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import invariant_violation from "../../common/err/invariant_violation";
import { useAppEntityIdSelectorEnforce } from "../../common/hooks/useAppEntityIdSelector";
import { Strategy } from "../../core/Strategy";
import templateSlice, {
  selectors as templateStepSelectors,
} from "../../features/template/templateSlice";
import { gameSelector } from "../../features/game/gameSlice";
import { StepId } from "../IGame";

export default function GenericItemsListPanel({ stepId }: { stepId: StepId }) {
  const dispatch = useAppDispatch();

  const game = useAppSelector(gameSelector);

  const step = useAppEntityIdSelectorEnforce(templateStepSelectors, stepId);
  if (step.strategy !== Strategy.FIXED) {
    invariant_violation(`strategy isn't FIXED for step ${stepId}`);
  }

  const items = useMemo(() => game.at(step.id)!.items, [game, step.id]);

  if (items == null || items.length === 0) {
    invariant_violation(
      `Step ${stepId} does not have any valid items for use with the FIXED strategy`
    );
  }

  return (
    <>
      {items.map((item) => (
        <Chip
          key={`${step.id}_${item}`}
          variant={step.value === item ? "filled" : "outlined"}
          label={game.at(stepId)!.labelForItem!(item)}
          onClick={
            step.value !== item
              ? () =>
                  dispatch(
                    templateSlice.actions.constantValueChanged({
                      id: step.id,
                      global: false,
                      value: item,
                    })
                  )
              : undefined
          }
        />
      ))}
    </>
  );
}
