import { List } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import templateSlice, {
  selectors as templateStepSelectors,
} from "./templateSlice";
import { Strategy } from "../../core/Strategy";
import TemplateItem from "./TemplateItem";
import { EntityId } from "@reduxjs/toolkit";

export default function Template() {
  const dispatch = useAppDispatch();

  const [expandedStepId, setExpandedStepId] = useState<EntityId>();

  const stepIds = useAppSelector(templateStepSelectors.selectIds);

  useEffect(() => {
    if (stepIds.length === 0) {
      dispatch(
        templateSlice.actions.initialized([
          // TODO: We shouldn't need to initialize the template here...
          { name: "map", strategy: Strategy.OFF },
          { name: "cityTiles", strategy: Strategy.OFF },
          { name: "bonusTiles", strategy: Strategy.OFF },
          { name: "initialMarket", strategy: Strategy.OFF },
          { name: "marketDeck", strategy: Strategy.OFF },
          { name: "concordiaCard", strategy: Strategy.OFF },
          { name: "playOrder", strategy: Strategy.OFF },
          { name: "playerColor", strategy: Strategy.OFF },
          { name: "playerPieces", strategy: Strategy.OFF },
          { name: "startingMoney", strategy: Strategy.OFF },
          { name: "praefectusMagnus", strategy: Strategy.OFF },
        ])
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
