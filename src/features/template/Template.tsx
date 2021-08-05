import { List } from "@material-ui/core";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import templateSlice, {
  selectors as templateStepSelectors,
} from "./templateSlice";
import { Strategy } from "../../core/Strategy";
import TemplateItem from "./TemplateItem";

export default function Template() {
  const dispatch = useAppDispatch();

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
          { name: "playerColor", strategy: Strategy.OFF },
          { name: "startingPlayer", strategy: Strategy.OFF },
          // { name: "playOrder", strategy: Strategy.OFF },
        ])
      );
    }
  }, [stepIds, dispatch]);

  return (
    <List component="ol">
      {stepIds.map((stepId) => (
        <TemplateItem stepId={stepId} />
      ))}
    </List>
  );
}
