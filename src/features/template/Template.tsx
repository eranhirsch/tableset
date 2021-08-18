import { List } from "@material-ui/core";
import { useState } from "react";
import TemplateItem from "./TemplateItem";
import { EntityId } from "@reduxjs/toolkit";
import ConcordiaGame from "../../core/games/concordia/ConcordiaGame";

export default function Template() {
  const [expandedStepId, setExpandedStepId] = useState<EntityId>();

  return (
    <List component="ol">
      {ConcordiaGame.order.map((stepId) => (
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
