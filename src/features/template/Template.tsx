import { List } from "@material-ui/core";
import { useMemo, useState } from "react";
import TemplateItem from "./TemplateItem";
import { EntityId } from "@reduxjs/toolkit";
import ConcordiaGame from "../../core/games/concordia/ConcordiaGame";
import { useAppSelector } from "../../app/hooks";
import { selectors } from "./templateSlice";

export default function Template() {
  const [expandedStepId, setExpandedStepId] = useState<EntityId>();

  const template = useAppSelector(selectors.selectEntities);

  const templatableItems = useMemo(
    () =>
      ConcordiaGame.order.filter(
        (stepId) => ConcordiaGame.strategiesFor(stepId, template).length > 1
      ),
    [template]
  );

  return (
    <List component="ol">
      {templatableItems.map((stepId) => (
        <TemplateItem
          key={stepId}
          stepId={stepId}
          expanded={stepId === expandedStepId}
          onClick={(isExpanded) =>
            setExpandedStepId(isExpanded ? undefined : stepId)
          }
        />
      ))}
    </List>
  );
}
