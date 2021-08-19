import { List } from "@material-ui/core";
import { useMemo, useState } from "react";
import TemplateItem from "./TemplateItem";
import { EntityId } from "@reduxjs/toolkit";
import ConcordiaGame from "../../games/concordia/ConcordiaGame";
import { useAppSelector } from "../../app/hooks";
import { selectors as templateSelectors } from "./templateSlice";
import { selectors as playersSelectors } from "../players/playersSlice";

export default function Template() {
  const [expandedStepId, setExpandedStepId] = useState<EntityId>();

  const template = useAppSelector(templateSelectors.selectEntities);
  const playersTotal = useAppSelector(playersSelectors.selectTotal);

  const templatableItems = useMemo(
    () =>
      ConcordiaGame.order.filter(
        (stepId) =>
          ConcordiaGame.strategiesFor(stepId, template, playersTotal).length > 1
      ),
    [playersTotal, template]
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
