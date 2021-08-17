import { List } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import templateSlice, {
  selectors as templateStepSelectors,
} from "./templateSlice";
import { Strategy } from "../../core/Strategy";
import TemplateItem from "./TemplateItem";
import { EntityId } from "@reduxjs/toolkit";
import ConcordiaGame from "../../core/games/concordia/ConcordiaGame";

export default function Template() {
  const dispatch = useAppDispatch();

  const [expandedStepId, setExpandedStepId] = useState<EntityId>();

  const stepIds = useAppSelector(templateStepSelectors.selectIds);

  useEffect(() => {
    if (stepIds.length === 0) {
      dispatch(
        templateSlice.actions.initialized(
          ConcordiaGame.order.map((id) => ({
            id,
            // TODO: We can pick better default/initial values for each step,
            // but for now, because all steps support OFF, we can set everything
            // to OFF safely
            strategy: Strategy.OFF,
          }))
        )
      );
    }
  }, [stepIds, dispatch]);

  return (
    <List component="ol">
      {stepIds.map((stepId) => (
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
