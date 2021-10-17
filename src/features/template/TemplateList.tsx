import { List } from "@mui/material";
import { ReactUtils, Vec } from "common";
import { gameStepsSelectorByType } from "features/game/gameSlice";
import { useFeaturesContext } from "features/useFeaturesContext";
import { StepId } from "model/Game";
import { useMemo, useState } from "react";
import { useAppSelector } from "../../app/hooks";
import { isTemplatable } from "./Templatable";
import { TemplateItem } from "./TemplateItem";
import { templateSelectors } from "./templateSlice";

export function TemplateList(): JSX.Element {
  const stepIds = useActiveTemplateStepIds();
  const [selectedStepId, setSelectedStepId] = useState<StepId>();

  return (
    <List
      sx={{
        maxHeight: "100%",
        ...ReactUtils.SX_SCROLL_WITHOUT_SCROLLBARS,
      }}
    >
      {Vec.map(stepIds, (stepId) => (
        <TemplateItem
          key={stepId}
          stepId={stepId}
          selected={stepId === selectedStepId}
          onClick={() => {
            setSelectedStepId((current) =>
              stepId === current ? undefined : stepId
            );
          }}
        />
      ))}
    </List>
  );
}

function useActiveTemplateStepIds(): readonly StepId[] {
  const templatableSteps = useAppSelector(
    gameStepsSelectorByType(isTemplatable)
  );
  const template = useAppSelector(templateSelectors.selectEntities);
  const context = useFeaturesContext();
  return useMemo(
    () =>
      Vec.map(
        Vec.filter(templatableSteps, (step) =>
          step.canBeTemplated(template, context)
        ),
        ({ id }) => id
      ),
    [context, templatableSteps, template]
  );
}
