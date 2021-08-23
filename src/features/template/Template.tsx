import { Fab, List } from "@material-ui/core";
import { useMemo, useState } from "react";
import TemplateItem from "./TemplateItem";
import { EntityId } from "@reduxjs/toolkit";
import ConcordiaGame from "../../games/concordia/ConcordiaGame";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectors as templateSelectors } from "./templateSlice";
import { selectors as playersSelectors } from "../players/playersSlice";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import instanceSlice from "../instance/instanceSlice";

export default function Template() {
  const dispatch = useAppDispatch();
  const [expandedStepId, setExpandedStepId] = useState<EntityId>();

  const template = useAppSelector(templateSelectors.selectEntities);
  const playerIds = useAppSelector(playersSelectors.selectIds);

  const allItems = ConcordiaGame.order;
  const templatableItems = useMemo(
    () =>
      allItems.filter(
        (stepId) =>
          ConcordiaGame.strategiesFor(stepId, template, playerIds.length)
            .length > 1
      ),
    [allItems, playerIds.length, template]
  );

  return (
    <>
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
      <Fab
        sx={{ position: "absolute", bottom: 16, right: 16 }}
        color="primary"
        aria-label="go"
        onClick={() => {
          dispatch(instanceSlice.actions.created(template, playerIds));
        }}
      >
        <PlayArrowIcon />
      </Fab>
    </>
  );
}
