import { List } from "@mui/material";
import { ReactUtils, Vec } from "common";
import { gameStepsSelectorByType } from "features/game/gameSlice";
import { useFeaturesContext } from "features/useFeaturesContext";
import { StepId } from "model/Game";
import { useMemo, useState } from "react";
import { useAppSelector } from "../../app/hooks";
import { isTemplatable, Templatable } from "./Templatable";
import { TemplateItem } from "./TemplateItem";
import { templateSelectors } from "./templateSlice";

export function TemplateList(): JSX.Element {
  const templatables = useActiveTemplateSteps();
  const [selectedStepId, setSelectedStepId] = useState<StepId>();

  return (
    <List
      sx={{
        maxHeight: "100%",
        ...ReactUtils.SX_SCROLL_WITHOUT_SCROLLBARS,
      }}
    >
      {Vec.map(templatables, (templatable) => (
        <TemplateItem
          key={templatable.id}
          templatable={templatable}
          selected={templatable.id === selectedStepId}
          onExpand={() => setSelectedStepId(templatable.id)}
          onCollapse={() => setSelectedStepId(undefined)}
        />
      ))}
    </List>
  );
}

function useActiveTemplateSteps(): readonly Templatable[] {
  const templatableSteps = useAppSelector(
    gameStepsSelectorByType(isTemplatable)
  );
  const template = useAppSelector(templateSelectors.selectEntities);
  const context = useFeaturesContext();
  return useMemo(
    () =>
      Vec.filter(templatableSteps, (step) =>
        step.canBeTemplated(template, context)
      ),
    [context, templatableSteps, template]
  );
}
